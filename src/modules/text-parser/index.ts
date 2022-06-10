import { CharType } from "@core/parser/char-type";
import { isDocumentRoot } from "@core/parser/is";
import { lex } from "@core/parser/lexer";
import { parse } from "@core/parser/parse";
import { Char, DocumentRoot, EvaluateFn, NodeWithChars, NodeWithChildren, Reader } from "@core/parser/types";
import { userSettingsStore } from "@core/settings/user-settings";
import { tail } from "@utils/array";
import { Either, Switch } from "or-else";
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
		lineNode.data.parsed = line.match(/([-\w]+)(=["']?((?:.(?!["']?\s+(?:\S+)=|\s*\/?[>"']))+.)["']?)?/g);
		lineNode.range = { start: chars[0].position, end: tail(chars).position };
		lineNode.chars = chars;
	} else if (/^!\[\[.*]]$/.test(line)) {
		lineNode = createNodeWithChars(TextNodeWithCharsType.EMBED, tree, chars[0], metadata.depth + 1);
		lineNode.data.href = line.slice(3, -2);

		// TODO: Extract to a function and reuse in opening image/video/audio files
		const associations: any[] = userSettingsStore.get("explorer.associations");
		const extension = `.${(lineNode.data.href as string).split(".").reverse()[0]}`;
		const association = associations.find((a) => a.extension === extension);

		const getLinkContentType = Switch.of(lineNode.data.href as string)
			.case(
				(x) => x.startsWith("http"),
				() =>
					Switch.of(lineNode.data.href as string)
						.case((x) => x.includes("youtube.com") || x.includes("youtu.be"), "youtube")
						.case((x) => x.includes("twitter.com"), "twitter")
						.case(() => Boolean(association) && association.association === "image", "remotemimage")
						.default("link"),
			)
			.default(() => {
				return Switch.of(association)
					.case((x: any) => Boolean(x) && x.association === "image", "image")
					.case((x: any) => Boolean(x) && x.association === "audio", "audio")
					.case((x: any) => Boolean(x) && x.association === "video", "video")
					.default("document");
			});

		lineNode.data.contentType = getLinkContentType();
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

export const extractFrontmatter = (raw: string): { raw: string; frontmatter: Record<string, any> | null } => {
	const lines = raw.split("\n");
	let frontmatter: Record<string, any> | null = null;

	if (lines[0] === "---" && lines[2] === "---") {
		frontmatter = JSON.parse(lines[1]);
		return { raw: lines.slice(3).join("\n"), frontmatter };
	}

	return { raw, frontmatter };
};

export const parseText = (raw: string, tree: NodeWithChildren | DocumentRoot) => {
	tree.raw = raw;

	if (isDocumentRoot(tree)) {
		tree.data.length = raw.length;
		const frontmatterParsed = extractFrontmatter(tree.raw);
		tree.raw = frontmatterParsed.raw;
		tree.data.frontmatter = frontmatterParsed.frontmatter;
	}

	const lines = tree.raw.split("\n");

	const metadata = { depth: tree.depth };
	tree.range = {
		start: { line: 1, character: 1, offset: 1 },
		end: { line: lines.length, character: tail(lines).length, offset: raw.length },
	};

	lines.forEach((line, index) => {
		tree.children.push(parseLine(line, index, tree, metadata));
	});
};

export const parseLineContent = parse({
	afterParse: (tree, reader) => {
		tree.range.end.character = reader.getChars().length;
	},
	parsers: [
		{
			evaluate: (char) => Boolean(char) && char!.type === CharType.STAR,
			parse: (char, tree, reader) => {
				if (Boolean(reader.lookAhead()) && reader.lookAhead()!.type === CharType.STAR) {
					if (!char) return reader.next();

					const chars: Char[] = [char];

					let currentChar: Char | null = reader.next();

					if (currentChar) {
						chars.push(currentChar!);
						currentChar = reader.next();
					}

					if (currentChar) {
						chars.push(currentChar!);
						currentChar = reader.next();
					}

					while (currentChar && reader.backTrack() && reader.backTrack()!.type !== CharType.STAR) {
						chars.push(currentChar);
						currentChar = reader.next();
					}

					if (currentChar && currentChar.type === CharType.STAR) {
						chars.push(currentChar);
						currentChar = reader.next();

						const inline = createNodeWithChildren(TextNodeWithChildrenType.BOLD, tree, char);

						inline.openingChars = chars.slice(0, 2);
						inline.closingChars = chars.slice(-2);
						inline.raw = chars.reduce((str, char) => str.concat(char.value), "");
						inline.range = { start: chars[0].position, end: tail(chars).position };

						parseLineContent(chars.slice(2, -2), inline);

						tree.children.push(inline);
					} else {
						const inline = createNodeWithChars(TextNodeWithCharsType.TEXT, tree, char);
						inline.raw = chars.reduce((str, char) => str.concat(char.value), "");
						inline.chars = chars;
						tree.children.push(inline);
					}

					return currentChar;
				} else {
					if (!char) return reader.next();

					const chars: Char[] = [char];

					let currentChar: Char | null = reader.next();

					if (currentChar) {
						chars.push(currentChar!);
						currentChar = reader.next();
					}

					while (currentChar && currentChar.type !== CharType.STAR) {
						chars.push(currentChar);
						currentChar = reader.next();
					}

					if (currentChar) {
						chars.push(currentChar);
						currentChar = reader.next();

						const inline = createNodeWithChildren(TextNodeWithChildrenType.ITALIC, tree, char);

						inline.openingChars = chars.slice(0, 1);
						inline.closingChars = chars.slice(-1);
						inline.raw = chars.reduce((str, char) => str.concat(char.value), "");
						inline.range = { start: chars[0].position, end: tail(chars).position };

						parseLineContent(chars.slice(1, -1), inline);

						tree.children.push(inline);
					} else {
						const inline = createNodeWithChars(TextNodeWithCharsType.TEXT, tree, char);
						inline.raw = chars.reduce((str, char) => str.concat(char.value), "");
						inline.chars = chars;
						tree.children.push(inline);
					}

					return currentChar;
				}
			},
		},
		{
			evaluate: (char) => Boolean(char) && char!.type === CharType.UNDERSCORE,
			parse: (char, tree, reader) => {
				if (Boolean(reader.lookAhead()) && reader.lookAhead()!.type === CharType.UNDERSCORE) {
					if (!char) return reader.next();

					const chars: Char[] = [char];

					let currentChar: Char | null = reader.next();

					if (currentChar) {
						chars.push(currentChar!);
						currentChar = reader.next();
					}

					if (currentChar) {
						chars.push(currentChar!);
						currentChar = reader.next();
					}

					while (currentChar && reader.backTrack() && reader.backTrack()!.type !== CharType.UNDERSCORE) {
						chars.push(currentChar);
						currentChar = reader.next();
					}

					if (currentChar && currentChar.type === CharType.UNDERSCORE) {
						chars.push(currentChar);
						currentChar = reader.next();

						const inline = createNodeWithChildren(TextNodeWithChildrenType.BOLD, tree, char);

						inline.openingChars = chars.slice(0, 2);
						inline.closingChars = chars.slice(-2);
						inline.raw = chars.reduce((str, char) => str.concat(char.value), "");
						inline.range = { start: chars[0].position, end: tail(chars).position };

						parseLineContent(chars.slice(2, -2), inline);

						tree.children.push(inline);
					} else {
						const inline = createNodeWithChars(TextNodeWithCharsType.TEXT, tree, char);
						inline.raw = chars.reduce((str, char) => str.concat(char.value), "");
						inline.chars = chars;
						tree.children.push(inline);
					}

					return currentChar;
				} else {
					if (!char) return reader.next();

					const chars: Char[] = [char];

					let currentChar: Char | null = reader.next();

					if (currentChar) {
						chars.push(currentChar!);
						currentChar = reader.next();
					}

					while (currentChar && currentChar.type !== CharType.UNDERSCORE) {
						chars.push(currentChar);
						currentChar = reader.next();
					}

					if (currentChar) {
						chars.push(currentChar);
						currentChar = reader.next();

						const inline = createNodeWithChildren(TextNodeWithChildrenType.ITALIC, tree, char);

						inline.openingChars = chars.slice(0, 1);
						inline.closingChars = chars.slice(-1);
						inline.raw = chars.reduce((str, char) => str.concat(char.value), "");
						inline.range = { start: chars[0].position, end: tail(chars).position };

						parseLineContent(chars.slice(1, -1), inline);

						tree.children.push(inline);
					} else {
						const inline = createNodeWithChars(TextNodeWithCharsType.TEXT, tree, char);
						inline.raw = chars.reduce((str, char) => str.concat(char.value), "");
						inline.chars = chars;
						tree.children.push(inline);
					}

					return currentChar;
				}
			},
		},
		{
			evaluate: (char, _, reader) =>
				Boolean(char) &&
				char!.type === CharType.TILDE &&
				Boolean(reader.lookAhead()) &&
				reader.lookAhead()!.type === CharType.TILDE,
			parse: (char, tree, reader) => {
				if (!char) return reader.next();

				const chars: Char[] = [char];

				let currentChar: Char | null = reader.next();

				if (currentChar) {
					chars.push(currentChar!);
					currentChar = reader.next();
				}

				if (currentChar) {
					chars.push(currentChar!);
					currentChar = reader.next();
				}

				while (currentChar && reader.backTrack() && reader.backTrack()!.type !== CharType.TILDE) {
					chars.push(currentChar);
					currentChar = reader.next();
				}

				if (currentChar && currentChar.type === CharType.TILDE) {
					chars.push(currentChar);
					currentChar = reader.next();

					const inline = createNodeWithChildren(TextNodeWithChildrenType.STRIKETHROUGH, tree, char);

					inline.openingChars = chars.slice(0, 2);
					inline.closingChars = chars.slice(-2);
					inline.raw = chars.reduce((str, char) => str.concat(char.value), "");
					inline.range = { start: chars[0].position, end: tail(chars).position };

					parseLineContent(chars.slice(2, -2), inline);

					tree.children.push(inline);
				} else {
					const inline = createNodeWithChars(TextNodeWithCharsType.TEXT, tree, char);
					inline.raw = chars.reduce((str, char) => str.concat(char.value), "");
					inline.chars = chars;
					tree.children.push(inline);
				}

				return currentChar;
			},
		},
		{
			evaluate: (char, _, reader) =>
				Boolean(char) &&
				char!.type === CharType.BRACKET_OPEN &&
				Boolean(reader.lookAhead()) &&
				reader.lookAhead()!.type === CharType.BRACKET_OPEN,
			parse: (char, tree, reader) => {
				if (!char) return reader.next();

				const chars: Char[] = [char];
				let currentChar: Char | null = reader.next();

				if (currentChar) {
					chars.push(currentChar!);
					currentChar = reader.next();
				}

				if (currentChar) {
					chars.push(currentChar!);
					currentChar = reader.next();
				}

				while (currentChar && reader.backTrack() && reader.backTrack()!.type !== CharType.BRACKET_CLOSE) {
					chars.push(currentChar);
					currentChar = reader.next();
				}

				if (currentChar && currentChar.type === CharType.BRACKET_CLOSE) {
					chars.push(currentChar);
					currentChar = reader.next();

					const inline = createNodeWithChars(TextNodeWithCharsType.LINK, tree, char);

					inline.raw = chars.reduce((str, char) => str.concat(char.value), "");
					inline.range = { start: chars[0].position, end: tail(chars).position };
					inline.data.href = chars.slice(2, -2).reduce((str, char) => str.concat(char.value), "");

					inline.data.contentType = Either.try(() => new URL(inline.data.href as string)).fold(
						() => "internal",
						() => "external",
					);

					inline.chars = chars;

					tree.children.push(inline);
				} else {
					const inline = createNodeWithChars(TextNodeWithCharsType.TEXT, tree, char);
					inline.raw = chars.reduce((str, char) => str.concat(char.value), "");
					inline.chars = chars;
					tree.children.push(inline);
				}

				return currentChar;
			},
		},
		{
			evaluate: (char) => Boolean(char) && char!.type === CharType.HASH,
			parse: (char, tree, reader) => {
				if (!char) return reader.next();

				const chars: Char[] = [char];
				let currentChar: Char | null = reader.next();

				while (
					currentChar &&
					(currentChar.type === CharType.CHAR ||
						currentChar.type === CharType.UNDERSCORE ||
						currentChar.type === CharType.SLASH ||
						currentChar.type === CharType.HYPHEN ||
						currentChar.type === CharType.OCTET)
				) {
					currentChar.position.line = tree.range.start.line;
					chars.push(currentChar);

					currentChar = reader.next();
				}

				const inline = createNodeWithChars(TextNodeWithCharsType.TAG, tree, char);

				inline.range.end.character = tail(chars).position.character;
				inline.raw = chars.reduce((str, char) => str.concat(char.value), "");
				inline.chars = chars;
				inline.range = { start: chars[0].position, end: tail(chars).position };
				inline.data.tag = chars.slice(1).reduce((str, char) => str.concat(char.value), "");

				tree.children.push(inline);

				return currentChar;
			},
		},
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
			evaluate: (char, _, reader) => !shouldBreakDefaultParsing(char, reader),
			parse: (char, tree, reader) => {
				if (!char) return reader.next();

				const inline = createNodeWithChars(TextNodeWithCharsType.TEXT, tree, char);
				let currentChar: Char | null = char;

				while (currentChar && !shouldBreakDefaultParsing(currentChar, reader)) {
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

const shouldBreakDefaultParsing = (char: Char | null, reader: Reader) =>
	!char ||
	char.type === CharType.BACKTICK ||
	(char.type === CharType.HASH &&
		reader.lookAhead() &&
		(reader.lookAhead()!.type === CharType.CHAR ||
			reader.lookAhead()!.type === CharType.UNDERSCORE ||
			reader.lookAhead()!.type === CharType.SLASH ||
			reader.lookAhead()!.type === CharType.HYPHEN ||
			reader.lookAhead()!.type === CharType.OCTET)) ||
	char.type === CharType.STAR ||
	char.type === CharType.UNDERSCORE ||
	(char.type === CharType.BRACKET_OPEN && reader.lookAhead() && reader.lookAhead()!.type === CharType.BRACKET_OPEN) ||
	(char.type === CharType.TILDE && reader.lookAhead() && reader.lookAhead()!.type === CharType.TILDE);
