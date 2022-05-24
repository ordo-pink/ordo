import { CharType } from "@core/parser/char-type";
import { isDocumentRoot } from "@core/parser/is";
import { lex } from "@core/parser/lexer";
import { parse } from "@core/parser/parse";
import { Char, DocumentRoot, EvaluateFn, NodeWithChars, NodeWithChildren, Reader } from "@core/parser/types";
import { tail } from "@utils/array";
import { TextNodeWithCharsType, TextNodeWithChildrenType } from "./enums";

export const createNodeWithChildren = <Type extends TextNodeWithChildrenType = TextNodeWithChildrenType.PARAGRAPH>(
	type: Type,
	parent: NodeWithChildren,
	firstChar: Char,
	depth?: number,
): NodeWithChildren<Type> => ({
	children: [],
	openingChars: [],
	closingChars: [],
	data: {},
	depth: depth ? depth : parent.depth + 1,
	id: `${parent.id}-${firstChar.position.line}`,
	raw: "",
	range: {
		start: { ...firstChar.position },
		end: { ...firstChar.position },
	},
	type,
});

export const createNodeWithChars = <Type extends TextNodeWithCharsType>(
	type: Type,
	parent: NodeWithChildren,
	firstChar: Char,
	depth?: number,
): NodeWithChars<Type> => ({
	chars: [],
	data: {},
	depth: depth ? depth : parent.depth + 1,
	id: `${parent.id}-${firstChar.position.character}`,
	raw: "",
	range: {
		start: { ...firstChar.position },
		end: { ...firstChar.position },
	},
	type,
});

export const parseLine = (line: string, index: number, tree: NodeWithChildren, metadata: { depth: number }) => {
	const chars = lex(line, index + 1);

	let lineNode: NodeWithChildren | NodeWithChars;

	if (!chars.length) {
		lineNode = createNodeWithChildren(
			TextNodeWithChildrenType.PARAGRAPH,
			tree,
			{ position: { line: index + 1, character: 0 } } as Char,
			metadata.depth + 1,
		);

		parseLineContent([], lineNode);
	} else if (/^<.*\/>$/.test(line)) {
		lineNode = createNodeWithChars(TextNodeWithCharsType.COMPONENT, tree, chars[0], metadata.depth + 1);
		lineNode.data.parsed = line.match(/(\w+)=["']?((?:.(?!["']?\s+(?:\S+)=|\s*\/?[>"']))+.)["']?/);
		lineNode.range = { start: chars[0].position, end: tail(chars).position };
		lineNode.chars = chars;
	} else if (/^!\[\[.*]]$/.test(line)) {
		lineNode = createNodeWithChars(TextNodeWithCharsType.EMBED, tree, chars[0], metadata.depth + 1);
		lineNode.data.relativePath = line.slice(3, -2);
		lineNode.range = { start: chars[0].position, end: tail(chars).position };
		lineNode.chars = chars;
	} else if (line.startsWith("# ")) {
		metadata.depth = 1;
		lineNode = createNodeWithChildren(TextNodeWithChildrenType.HEADING, tree, chars[0], metadata.depth);
		lineNode.openingChars = chars.slice(0, 2);
		parseLineContent(chars.slice(2), lineNode);
	} else if (line.startsWith("## ")) {
		metadata.depth = 2;
		lineNode = createNodeWithChildren(TextNodeWithChildrenType.HEADING, tree, chars[0], metadata.depth);
		lineNode.openingChars = chars.slice(0, 3);
		parseLineContent(chars.slice(3), lineNode);
	} else if (line.startsWith("### ")) {
		metadata.depth = 3;
		lineNode = createNodeWithChildren(TextNodeWithChildrenType.HEADING, tree, chars[0], metadata.depth);
		lineNode.openingChars = chars.slice(0, 4);
		parseLineContent(chars.slice(4), lineNode);
	} else if (line.startsWith("#### ")) {
		metadata.depth = 4;
		lineNode = createNodeWithChildren(TextNodeWithChildrenType.HEADING, tree, chars[0], metadata.depth);
		lineNode.openingChars = chars.slice(0, 5);
		parseLineContent(chars.slice(5), lineNode);
	} else if (line.startsWith("##### ")) {
		metadata.depth = 5;
		lineNode = createNodeWithChildren(TextNodeWithChildrenType.HEADING, tree, chars[0], metadata.depth);
		lineNode.openingChars = chars.slice(0, 6);
		parseLineContent(chars.slice(6), lineNode);
	} else if (line === "---") {
		lineNode = createNodeWithChars(TextNodeWithCharsType.HR, tree, chars[0], metadata.depth + 1);
		lineNode.range = { start: chars[0].position, end: tail(chars).position };
		lineNode.chars = chars;
	} else if (line.startsWith("[ ] ") || line.startsWith("[x] ")) {
		lineNode = createNodeWithChildren(TextNodeWithChildrenType.TODO, tree, chars[0], metadata.depth + 1);
		lineNode.data.checked = line.charAt(1) === "x";
		lineNode.openingChars = chars.slice(0, 4);
		parseLineContent(chars.slice(4), lineNode);
	} else {
		lineNode = createNodeWithChildren(TextNodeWithChildrenType.PARAGRAPH, tree, chars[0], metadata.depth + 1);
		parseLineContent(chars, lineNode);
	}

	lineNode.raw = line;
	return lineNode;
};

export const parseText = (raw: string, tree: NodeWithChildren | DocumentRoot) => {
	const lines = raw.split("\n");
	tree.raw = raw;
	const metadata = { depth: tree.depth };
	tree.range = {
		start: { line: 1, character: 1, offset: 1 },
		end: { line: lines.length, character: tail(lines).length, offset: raw.length },
	};

	if (isDocumentRoot(tree)) {
		tree.data.length = raw.length;
	}

	lines.forEach((line, index) => {
		tree.children.push(parseLine(line, index, tree, metadata));
	});
};

const specialCharTypes = [CharType.BACKTICK];

export const parseLineContent = parse({
	afterParse: (tree, reader) => {
		tree.range.end.character = reader.getChars().length;
	},
	parsers: [
		{
			evaluate: (char) => Boolean(char) && char!.type === CharType.BACKTICK,
			parse: (char, tree, reader) => {
				if (!char) return reader.next();

				const chars: Char[] = [char];
				let currentChar: Char | null = reader.next();

				while (currentChar && currentChar.type !== CharType.BACKTICK) {
					currentChar.position.line = tree.range.start.line;
					chars.push(currentChar);

					currentChar = reader.next();
				}

				if (currentChar && currentChar.type === CharType.BACKTICK) {
					const inline = createNodeWithChildren(TextNodeWithChildrenType.CODE, tree, char);

					chars.push(currentChar);

					inline.range.end.character = tail(chars).position.character;
					inline.raw = chars.reduce((str, char) => str.concat(char.value), "");
					inline.openingChars = [chars[0]];
					inline.closingChars = [tail(chars)];
					parseLineContent(chars.slice(1, -1), inline);

					tree.children.push(inline);

					currentChar = reader.next();
				} else {
					const inline = createNodeWithChars(TextNodeWithCharsType.TEXT, tree, char);

					inline.range.end.character = tail(chars) && tail(chars).position.character;
					inline.raw = chars.reduce((str, char) => str.concat(char.value), "");
					inline.chars = chars;

					tree.children.push(inline);
				}

				return currentChar;
			},
		},
		{
			evaluate: (char) => Boolean(char) && !specialCharTypes.includes(char!.type),
			parse: (char, tree, reader) => {
				if (!char) return reader.next();

				const inline = createNodeWithChars(TextNodeWithCharsType.TEXT, tree, char);
				let currentChar: Char | null = char;

				while (currentChar && !specialCharTypes.includes(currentChar.type)) {
					currentChar.position.line = tree.range.start.line;

					inline.range.end.character = currentChar.position.character;
					inline.raw += currentChar.value;
					inline.chars.push(currentChar);

					currentChar = reader.next();
				}

				tree.children.push(inline);

				return currentChar;
			},
		},
	],
});
