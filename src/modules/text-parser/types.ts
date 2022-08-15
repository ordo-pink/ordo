import { NodeWithChars, NodeWithChildren } from "@core/parser/types";
import { TextNodeWithCharsType, TextNodeWithChildrenType } from "@modules/text-parser/enums";

export type LinkContentType = "internal" | "external";

export type EmbedContentType =
  | "youtube"
  | "twitter"
  | "remotemimage"
  | "link"
  | "video"
  | "audio"
  | "image"
  | "document";

export type TodoNode = NodeWithChildren<TextNodeWithChildrenType.TODO, { checked: boolean }>;
export type HeadingNode = NodeWithChildren<TextNodeWithChildrenType.HEADING>;
export type ToggleNode = NodeWithChildren<TextNodeWithChildrenType.TOGGLE, { title: string }>;
export type BoldNode = NodeWithChildren<TextNodeWithChildrenType.BOLD>;
export type CodeNode = NodeWithChildren<TextNodeWithChildrenType.CODE>;
export type ItalicNode = NodeWithChildren<TextNodeWithChildrenType.ITALIC>;
export type ParagraphNode = NodeWithChildren<TextNodeWithChildrenType.PARAGRAPH>;
export type StrikethroughNode = NodeWithChildren<TextNodeWithChildrenType.STRIKETHROUGH>;

export type ComponentNode = NodeWithChars<TextNodeWithCharsType.COMPONENT, { parsed: string[] }>;
export type EmbedNode = NodeWithChars<TextNodeWithCharsType.EMBED, { href: string; contentType: EmbedContentType }>;
export type HrNode = NodeWithChars<TextNodeWithCharsType.HR>;
export type TagNode = NodeWithChars<TextNodeWithCharsType.TAG, { tag: string }>;
export type LinkNode = NodeWithChars<TextNodeWithCharsType.LINK, { href: string; contentType: LinkContentType }>;
export type TextNode = NodeWithChars<TextNodeWithCharsType.TEXT>;
