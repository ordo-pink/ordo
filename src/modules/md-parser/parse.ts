import { createBlockToken } from "@modules/md-parser/create-block-token";
import { BlockTokenType, SymbolType } from "@modules/md-parser/enums";
import { parseInline } from "@modules/md-parser/parse-inline";
import { createReader } from "@modules/md-parser/reader";
import { TokenWithChildren, DocumentRoot, CodeBlockToken, Symbol } from "@modules/md-parser/types";

export const parse = (raw: string | Symbol[], tree?: TokenWithChildren): DocumentRoot => {
	const reader = createReader(raw);

	if (!tree) {
		tree = {
			type: BlockTokenType.ROOT,
			depth: 0,
			data: { length: raw.length, raw },
			children: [],
		} as unknown as DocumentRoot;
	}

	let symbol = reader.next();
	let depth = tree.depth;

	while (symbol) {
		const ahead = reader.lookAhead();
		const ahead2 = reader.lookAhead(2);
		const ahead3 = reader.lookAhead(3);
		const ahead4 = reader.lookAhead(4);
		const ahead5 = reader.lookAhead(5);

		const back = reader.backTrack();

		const isLineStart = !back || back.type === SymbolType.EOL;

		if (
			symbol &&
			symbol.type === SymbolType.CHEVRON_RIGHT &&
			isLineStart &&
			ahead &&
			ahead.type === SymbolType.WHITESPACE
		) {
			const subTree = createBlockToken(BlockTokenType.BLOCKQUOTE, depth, null, reader, symbol);
			tree.children.push(parseInline(subTree.symbols.slice(2), subTree));
			subTree.symbols = subTree.symbols.slice(0, 2);
		} else if (
			symbol &&
			symbol.type === SymbolType.EXCLAMATION_MARK &&
			isLineStart &&
			ahead &&
			ahead2 &&
			ahead.type === SymbolType.BRACKET_OPEN &&
			ahead2.type === SymbolType.BRACKET_OPEN
		) {
			const subTree = createBlockToken(BlockTokenType.EMBED, depth, null, reader, symbol);
			tree.children.push(parseInline(subTree.symbols.slice(3), subTree));
			subTree.symbols = subTree.symbols.slice(0, 3);
		} else if (
			symbol &&
			symbol.type === SymbolType.HYPHEN &&
			isLineStart &&
			ahead &&
			ahead2 &&
			ahead3 &&
			ahead.type === SymbolType.HYPHEN &&
			ahead2.type === SymbolType.HYPHEN &&
			ahead3.type === SymbolType.EOL
		) {
			const subTree = createBlockToken(BlockTokenType.DIVIDER, depth, null, reader, symbol);
			tree.children.push(parseInline(subTree.symbols, subTree));
			subTree.symbols = [];
		} else if (
			symbol &&
			symbol.type === SymbolType.BACKTICK &&
			isLineStart &&
			ahead &&
			ahead2 &&
			ahead.type === SymbolType.BACKTICK &&
			ahead2.type === SymbolType.BACKTICK
		) {
			if (tree.type !== BlockTokenType.CODE_BLOCK) {
				const subTree = createBlockToken(
					BlockTokenType.CODE_BLOCK,
					depth,

					{ language: null },
					reader,
					symbol,
					(symbol, reader) => {
						const back = reader.backTrack();
						const back2 = reader.backTrack(2);
						const back3 = reader.backTrack(3);

						return Boolean(
							(!symbol || symbol.type === SymbolType.EOL) &&
								back &&
								back2 &&
								back3 &&
								back.type === SymbolType.BACKTICK &&
								back2.type === SymbolType.BACKTICK &&
								back3.type === SymbolType.BACKTICK,
						);
					},
				);

				tree.children.push(parse(subTree.symbols, subTree));
			} else {
				const subTree = createBlockToken(BlockTokenType.PARAGRAPH, depth + 1, null, reader, symbol);
				tree.children.push(parseInline(subTree.symbols, subTree));

				(tree as CodeBlockToken).data.language = tree.symbols
					.slice(
						3,
						tree.symbols.findIndex((s) => s.type === SymbolType.EOL),
					)
					.reduce((acc, v) => acc.concat(v.value), "");
			}
		} else if (
			symbol &&
			(symbol.type === SymbolType.HYPHEN || symbol.type === SymbolType.STAR) &&
			isLineStart &&
			ahead &&
			ahead.type === SymbolType.WHITESPACE
		) {
			if (tree.type !== BlockTokenType.LIST) {
				const subTree = createBlockToken(
					BlockTokenType.LIST,
					depth,

					{ ordered: false },
					reader,
					symbol,
					(symbol, reader) => {
						const ahead = reader.lookAhead();
						return symbol.type === SymbolType.EOL && (!ahead || ahead.type === SymbolType.EOL);
					},
				);

				const parsed = parse(subTree.symbols, subTree);
				parsed.symbols = [];

				tree.children.push(parsed);
			} else {
				const subTree = createBlockToken(BlockTokenType.LIST_ITEM, depth + 1, { ordered: false }, reader, symbol);
				tree.children.push(parseInline(subTree.symbols, subTree));
			}
		} else if (
			symbol &&
			symbol.type === SymbolType.HASH &&
			isLineStart &&
			ahead &&
			ahead.type === SymbolType.WHITESPACE
		) {
			depth = 1;
			const subTree = createBlockToken(BlockTokenType.HEADING, depth, null, reader, symbol);
			tree.children.push(parseInline(subTree.symbols.slice(2), subTree));
			subTree.symbols = subTree.symbols.slice(0, 2);
			depth += 1;
		} else if (
			symbol &&
			symbol.type === SymbolType.HASH &&
			isLineStart &&
			ahead &&
			ahead2 &&
			ahead.type === SymbolType.HASH &&
			ahead2.type === SymbolType.WHITESPACE
		) {
			depth = 2;
			const subTree = createBlockToken(BlockTokenType.HEADING, depth, null, reader, symbol);
			tree.children.push(parseInline(subTree.symbols.slice(3), subTree));
			subTree.symbols = subTree.symbols.slice(0, 3);
			depth += 1;
		} else if (
			symbol &&
			symbol.type === SymbolType.HASH &&
			isLineStart &&
			ahead &&
			ahead2 &&
			ahead3 &&
			ahead.type === SymbolType.HASH &&
			ahead2.type === SymbolType.HASH &&
			ahead3.type === SymbolType.WHITESPACE
		) {
			depth = 3;
			const subTree = createBlockToken(BlockTokenType.HEADING, depth, null, reader, symbol);
			tree.children.push(parseInline(subTree.symbols.slice(4), subTree));
			subTree.symbols = subTree.symbols.slice(0, 4);
			depth += 1;
		} else if (
			symbol &&
			symbol.type === SymbolType.HASH &&
			isLineStart &&
			ahead &&
			ahead2 &&
			ahead3 &&
			ahead4 &&
			ahead.type === SymbolType.HASH &&
			ahead2.type === SymbolType.HASH &&
			ahead3.type === SymbolType.HASH &&
			ahead4.type === SymbolType.WHITESPACE
		) {
			depth = 4;
			const subTree = createBlockToken(BlockTokenType.HEADING, depth, null, reader, symbol);
			tree.children.push(parseInline(subTree.symbols.slice(5), subTree));
			subTree.symbols = subTree.symbols.slice(0, 5);
			depth += 1;
		} else if (
			symbol &&
			symbol.type === SymbolType.HASH &&
			isLineStart &&
			ahead &&
			ahead2 &&
			ahead3 &&
			ahead4 &&
			ahead5 &&
			ahead.type === SymbolType.HASH &&
			ahead2.type === SymbolType.HASH &&
			ahead3.type === SymbolType.HASH &&
			ahead4.type === SymbolType.HASH &&
			ahead5.type === SymbolType.WHITESPACE
		) {
			depth = 5;
			const subTree = createBlockToken(BlockTokenType.HEADING, depth, null, reader, symbol);
			tree.children.push(parseInline(subTree.symbols.slice(6), subTree));
			subTree.symbols = subTree.symbols.slice(0, 6);
			depth += 1;
		} else if (symbol) {
			if (tree.type === BlockTokenType.CODE_BLOCK) {
				const subTree = createBlockToken(BlockTokenType.PARAGRAPH, depth + 1, null, reader, symbol);
				tree.children.push(subTree);
			} else if (tree.type === BlockTokenType.LIST) {
				const subTree = createBlockToken(BlockTokenType.LIST_ITEM, depth + 1, null, reader, symbol);
				const parsedSubTree = parseInline(subTree.symbols, subTree);
				parsedSubTree.symbols = [];
				tree.children.push(parsedSubTree);
			} else {
				const subTree = createBlockToken(BlockTokenType.PARAGRAPH, depth, null, reader, symbol);
				const parsedSubTree = parseInline(subTree.symbols, subTree);
				parsedSubTree.symbols = [];
				tree.children.push(parsedSubTree);
			}
		}

		symbol = reader.next();
	}

	tree.symbols = [];

	return tree as DocumentRoot;
};
