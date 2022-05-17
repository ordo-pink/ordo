import { SymbolType, BlockTokenType, InlineTokenType } from "@modules/md-parser/enums";

export type MdSymbolPosition = {
	line: number;
	character: number;
	offset: number;
};

export type MdSymbolRange = {
	start: MdSymbolPosition;
	end: MdSymbolPosition;
};

export type MdSymbol = {
	type: SymbolType;
	value: string;
	position: MdSymbolRange;
};

// TODO: Add OpeningSymbols
// TODO: Add id
export type MdNode<TTokenType = BlockTokenType | InlineTokenType, TData = unknown> = {
	type: TTokenType;
	position: MdSymbolRange;
	children: MdNode[];
	data: TData;
	raw?: string;
	symbols: MdSymbol[];
	depth: number;
	closingSymbols: MdSymbol[];
};

export type MdDocument = MdNode<BlockTokenType.ROOT, { length: number }>;
export type MdHeading = MdNode<BlockTokenType.HEADING>;
export type MdBlockquote = MdNode<BlockTokenType.BLOCKQUOTE>;
export type MdParagraph = MdNode<BlockTokenType.PARAGRAPH>;
export type MdDivider = MdNode<BlockTokenType.DIVIDER>;
export type MdList = MdNode<BlockTokenType.LIST, { ordered: boolean }>;
export type MdListItem = MdNode<BlockTokenType.LIST_ITEM, { task: boolean; checked: boolean }>;
export type MdComponent = MdNode<BlockTokenType.COMPONENT, { name: string; attributes: Record<string, string> }>;
export type MdEmbed = MdNode<BlockTokenType.EMBED, { content: string }>;
export type MdCodeBlock = MdNode<BlockTokenType.CODE_BLOCK, { language: string }>;

export type LineToken =
	| MdDocument
	| MdHeading
	| MdBlockquote
	| MdParagraph
	| MdDivider
	| MdList
	| MdListItem
	| MdComponent
	| MdEmbed
	| MdCodeBlock;
