import { SymbolType, BlockTokenType, InlineTokenType } from "@modules/md-parser/enums";

export type Location = {
	line: number;
	character: number;
	offset: number;
};

export type Position = {
	start: Location;
	end: Location;
};

export type Symbol = {
	type: SymbolType;
	value: string;
	position: Position;
};

export type Token<TTokenType = BlockTokenType | InlineTokenType, TData = unknown> = {
	type: TTokenType;
	position: Position;
	children: Token[];
	data: TData;
	symbols: Symbol[];
	depth: number;
	closingSymbols: Symbol[];
};

export type DocumentRoot = Token<BlockTokenType.ROOT, { length: number }>;
export type HeadingToken = Token<BlockTokenType.HEADING>;
export type BlockquoteToken = Token<BlockTokenType.BLOCKQUOTE>;
export type ParagraphToken = Token<BlockTokenType.PARAGRAPH>;
export type DividerToken = Token<BlockTokenType.DIVIDER>;
export type ListToken = Token<BlockTokenType.LIST, { ordered: boolean }>;
export type ListItemToken = Token<BlockTokenType.LIST_ITEM, { task: boolean; checked: boolean }>;
export type ComponentToken = Token<BlockTokenType.COMPONENT, { name: string; attributes: Record<string, string> }>;
export type EmbedToken = Token<BlockTokenType.EMBED, { content: string }>;
export type CodeBlockToken = Token<BlockTokenType.CODE_BLOCK, { language: string }>;

export type MarkdownTree = {
	type: "root";
	length: number;
	children: Symbol[];
};
