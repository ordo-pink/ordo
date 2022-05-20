import { Char, NodeWithChars, NodeWithChildren } from "@core/parser/types";
import { BlockNodeType, InlineNodeType } from "@modules/md-parser/enums";

export type MarkdownChar = Char<{
	hidable: boolean;
}>;

export type MarkdownHeading = NodeWithChildren<BlockNodeType.HEADING>;
export type MarkdownBlockquote = NodeWithChildren<BlockNodeType.BLOCKQUOTE>;
export type MarkdownDivider = NodeWithChildren<BlockNodeType.DIVIDER>;
export type MarkdownEmbed = NodeWithChildren<BlockNodeType.EMBED, { content: string }>;
export type MarkdownComponent = NodeWithChildren<
	BlockNodeType.COMPONENT,
	{ name: string; attributes: Record<string, string> }
>;
export type MarkdownParagraph = NodeWithChildren<BlockNodeType.PARAGRAPH>;
export type MarkdownList = NodeWithChildren<BlockNodeType.LIST, { ordered: boolean }>;
export type MarkdownListItem = NodeWithChildren<BlockNodeType.LIST_ITEM, { task: boolean; checked: boolean }>;
export type MarkdownCodeBlock = NodeWithChildren<BlockNodeType.CODE_BLOCK, { language: string }>;

export type MarkdownText = NodeWithChars<InlineNodeType.TEXT> | NodeWithChildren<InlineNodeType.TEXT>;
export type MarkdownCode = NodeWithChars<InlineNodeType.CODE> | NodeWithChildren<InlineNodeType.CODE>;
export type MarkdownBold = NodeWithChars<InlineNodeType.BOLD> | NodeWithChildren<InlineNodeType.BOLD>;
export type MarkdownItalic = NodeWithChars<InlineNodeType.ITALIC> | NodeWithChildren<InlineNodeType.ITALIC>;
export type MarkdownLink = NodeWithChars<InlineNodeType.LINK> | NodeWithChildren<InlineNodeType.LINK>;
export type MarkdownStrikethrough =
	| NodeWithChars<InlineNodeType.STRIKETHROUGH>
	| NodeWithChildren<InlineNodeType.STRIKETHROUGH>;
export type MarkdownTag = NodeWithChars<InlineNodeType.TAG> | NodeWithChildren<InlineNodeType.TAG>;
