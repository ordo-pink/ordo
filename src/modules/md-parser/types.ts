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
	data: TData;
	symbols: Symbol[];
	depth: number;
};

export type TokenWithChildren<TTokenType = BlockTokenType | InlineTokenType, TData = unknown> = Token<
	TTokenType,
	TData
> & {
	children: Token[];
};

export type DocumentRoot = TokenWithChildren<BlockTokenType.ROOT, { length: number }>;
export type HeadingToken = TokenWithChildren<BlockTokenType.HEADING>;
export type BlockquoteToken = TokenWithChildren<BlockTokenType.BLOCKQUOTE>;
export type ParagraphToken = TokenWithChildren<BlockTokenType.PARAGRAPH>;
export type DividerToken = TokenWithChildren<BlockTokenType.DIVIDER>;
export type ListToken = TokenWithChildren<BlockTokenType.LIST, { ordered: boolean }>;
export type ListItemToken = TokenWithChildren<BlockTokenType.LIST_ITEM, { task: boolean; checked: boolean }>;
export type ComponentToken = TokenWithChildren<
	BlockTokenType.COMPONENT,
	{ name: string; attributes: Record<string, string> }
>;
export type EmbedToken = TokenWithChildren<BlockTokenType.EMBED, { content: string }>;
export type CodeBlockToken = TokenWithChildren<BlockTokenType.CODE_BLOCK, { language: string }>;

export type MarkdownTree = {
	type: "root";
	length: number;
	children: Symbol[];
};
