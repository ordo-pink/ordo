import { CharType } from "@core/parser/char-type";
import { isDocumentRoot } from "@core/parser/is";
import { lex } from "@core/parser/lexer";
import { parse } from "@core/parser/parse";
import { Char, DocumentRoot, EvaluateFn, NodeWithChars, NodeWithChildren, Reader } from "@core/parser/types";
import { tail } from "@utils/array";
import { BlockNodeType, InlineNodeType } from "./enums";

export const createLineNode = <Type extends BlockNodeType = BlockNodeType.LINE>(
	type: Type,
	parent: NodeWithChildren,
	firstChar: Char,
	depth: number,
): NodeWithChildren<Type> => ({
	children: [],
	data: null,
	depth: depth,
	id: `${parent.id}-${firstChar.position.line}`,
	raw: "",
	range: {
		start: { ...firstChar.position },
		end: { ...firstChar.position },
	},
	type,
});

export const createLineContentNode = <Type extends InlineNodeType>(
	type: Type,
	parent: NodeWithChildren,
	firstChar: Char,
): NodeWithChars<Type> => ({
	chars: [],
	data: null,
	depth: parent.depth + 1,
	id: `${parent.id}-${firstChar.position.character}`,
	raw: "",
	range: {
		start: { ...firstChar.position },
		end: { ...firstChar.position },
	},
	type,
});

export const reparseLine = (lineIndex: number, parent: NodeWithChildren) => {
	let node = parent.children[lineIndex] as NodeWithChildren;

	if (!node) {
		return;
	}

	parseText(node.raw, node);

	if (node.children[0].depth > 1) node.children[0].depth--;
	node.children[0].id = node.children[0].id.slice(0, -2);
	node = node.children[0] as NodeWithChildren;
	console.log(node, "\n\n\n\n\n");

	parent.children.splice(lineIndex, 1, node);
};

export const parseLine = (line: string, index: number, tree: NodeWithChildren, metadata: { depth: number }) => {
	const chars = lex(line, index + 1);

	let lineNode: NodeWithChildren<BlockNodeType, any>;

	if (!chars.length) {
		lineNode = createLineNode(
			BlockNodeType.LINE,
			tree,
			{ position: { line: index + 1, character: 0 } } as Char,
			metadata.depth + 1,
		);

		parseLineContent([], lineNode);
	} else if (line.startsWith("# ")) {
		metadata.depth = 1;
		lineNode = createLineNode(BlockNodeType.HEADING, tree, chars[0], metadata.depth);
		parseLineContent(chars, lineNode);

		const content = lineNode.children[0] as NodeWithChars<InlineNodeType, null, { hidable: boolean }>;
		content.chars[0].data = { hidable: true };
		content.chars[1].data = { hidable: true };
	} else if (line.startsWith("## ")) {
		metadata.depth = 2;
		lineNode = createLineNode(BlockNodeType.HEADING, tree, chars[0], metadata.depth);
		parseLineContent(chars, lineNode);

		const content = lineNode.children[0] as NodeWithChars<InlineNodeType, null, { hidable: boolean }>;
		content.chars[0].data = { hidable: true };
		content.chars[1].data = { hidable: true };
		content.chars[2].data = { hidable: true };
	} else if (line.startsWith("### ")) {
		metadata.depth = 3;
		lineNode = createLineNode(BlockNodeType.HEADING, tree, chars[0], metadata.depth);
		parseLineContent(chars, lineNode);

		const content = lineNode.children[0] as NodeWithChars<InlineNodeType, null, { hidable: boolean }>;
		content.chars[0].data = { hidable: true };
		content.chars[1].data = { hidable: true };
		content.chars[2].data = { hidable: true };
		content.chars[3].data = { hidable: true };
	} else if (line.startsWith("#### ")) {
		metadata.depth = 4;
		lineNode = createLineNode(BlockNodeType.HEADING, tree, chars[0], metadata.depth);
		parseLineContent(chars, lineNode);

		const content = lineNode.children[0] as NodeWithChars<InlineNodeType, null, { hidable: boolean }>;
		content.chars[0].data = { hidable: true };
		content.chars[1].data = { hidable: true };
		content.chars[2].data = { hidable: true };
		content.chars[3].data = { hidable: true };
		content.chars[4].data = { hidable: true };
	} else if (line.startsWith("##### ")) {
		metadata.depth = 5;
		lineNode = createLineNode(BlockNodeType.HEADING, tree, chars[0], metadata.depth);
		parseLineContent(chars, lineNode);

		const content = lineNode.children[0] as NodeWithChars<InlineNodeType, null, { hidable: boolean }>;
		content.chars[0].data = { hidable: true };
		content.chars[1].data = { hidable: true };
		content.chars[2].data = { hidable: true };
		content.chars[3].data = { hidable: true };
		content.chars[4].data = { hidable: true };
		content.chars[5].data = { hidable: true };
	} else if (line === "---") {
		lineNode = createLineNode(BlockNodeType.HR, tree, chars[0], metadata.depth + 1);

		parseLineContent(chars, lineNode);

		const content = lineNode.children[0] as NodeWithChars<InlineNodeType, null, { hidable: boolean }>;
		content.chars[0].data = { hidable: true };
		content.chars[1].data = { hidable: true };
		content.chars[2].data = { hidable: true };
	} else if (line.startsWith("[ ] ") || line.startsWith("[x] ")) {
		lineNode = createLineNode(BlockNodeType.TODO, tree, chars[0], metadata.depth + 1) as unknown as NodeWithChildren<
			BlockNodeType.TODO,
			{ checked: boolean }
		>;

		parseLineContent(chars, lineNode);

		lineNode.data = { checked: line.charAt(1) === "x" };

		const content = lineNode.children[0] as NodeWithChars<InlineNodeType, null, { hidable: boolean }>;
		content.chars[0].data = { hidable: true };
		content.chars[1].data = { hidable: true };
		content.chars[2].data = { hidable: true };
		content.chars[3].data = { hidable: true };
	} else {
		lineNode = createLineNode(BlockNodeType.LINE, tree, chars[0], metadata.depth + 1);
		parseLineContent(chars, lineNode);
	}

	lineNode.raw = line;

	return lineNode;
};

export const parseText = (raw: string, tree: NodeWithChildren | DocumentRoot) => {
	const lines = raw.split("\n");
	tree.raw = raw;
	const metadata = { depth: tree.depth };
	tree.range = { start: { line: 1, character: 1 }, end: { line: lines.length, character: tail(lines).length } };

	if (isDocumentRoot(tree)) {
		tree.length = raw.length;
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
					const inline = createLineContentNode(InlineNodeType.CODE, tree, char);

					chars.push(currentChar);

					inline.range.end.character = tail(chars).position.character;
					inline.raw = chars.reduce((str, char) => str.concat(char.value), "");
					inline.chars = chars;

					inline.chars[0].data = { hidable: true } as any;
					inline.chars[inline.chars.length - 1].data = { hidable: true } as any;

					tree.children.push(inline);

					currentChar = reader.next();
				} else {
					const inline = createLineContentNode(InlineNodeType.TEXT, tree, char);

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

				const inline = createLineContentNode(InlineNodeType.TEXT, tree, char);
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
