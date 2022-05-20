import { CharType } from "@core/parser/char-type";
import { isDocumentRoot } from "@core/parser/is";
import { parse } from "@core/parser/parse";
import { Char, NodeWithChars, NodeWithChildren } from "@core/parser/types";
import { tail } from "@utils/array";

const createLineNode = (parent: NodeWithChildren, firstChar: Char): NodeWithChildren<"line"> => ({
	children: [],
	data: null,
	depth: parent.depth + 1,
	id: `${parent.id}-${firstChar.position.line}`,
	raw: "",
	range: {
		start: { ...firstChar.position },
		end: { ...firstChar.position },
	},
	type: "line",
});

const createLineContentNode = (parent: NodeWithChildren, firstChar: Char): NodeWithChars<"text"> => ({
	chars: [],
	data: null,
	depth: parent.depth + 1,
	id: `${parent.id}-${firstChar.position.character}`,
	raw: "",
	range: {
		start: { ...firstChar.position },
		end: { ...firstChar.position },
	},
	type: "text",
});

export const parseText = parse({
	beforeParse: (tree, parser) => {
		const chars = parser.getChars();

		tree.raw = chars.reduce((str, char) => str.concat(char.value), "");
		tree.range.end.line = tail(chars).position.line;
		tree.range.end.character = chars.length;

		if (isDocumentRoot(tree)) {
			tree.length = chars.length;
		}
	},
	parsers: [
		{
			evaluate: (char) => Boolean(char) && char!.type !== CharType.EOL,
			parse: (char, tree, reader) => {
				if (!char) return reader.next();

				const block = createLineNode(tree, char);
				let currentChar: Char | null = char;
				const chars: Char[] = [];

				while (currentChar && currentChar.type !== CharType.EOL) {
					block.range.end.character = currentChar.position.character;
					block.raw += currentChar.value;
					chars.push(currentChar);

					currentChar = reader.next();
				}

				currentChar = reader.next();

				parseLineContent(chars, block);
				tree.children.push(block);

				return currentChar;
			},
		},
		{
			evaluate: (char) => Boolean(char) && char!.type === CharType.EOL,
			parse: (char, tree, reader) => {
				if (!char) return reader.next();

				char.position.character = 0;

				const block = createLineNode(tree, char);

				parseLineContent([], block);
				tree.children.push(block);

				return reader.next();
			},
		},
	],
});

export const parseLineContent = parse({
	afterParse: (tree, reader) => {
		tree.range.end.character = reader.getChars().length;
	},
	parsers: [
		{
			evaluate: () => true,
			parse: (char, tree, reader) => {
				if (!char) return reader.next();

				const inline = createLineContentNode(tree, char);
				let currentChar: Char | null = char;

				while (currentChar) {
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
