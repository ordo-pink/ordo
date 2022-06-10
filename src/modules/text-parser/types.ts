import { NodeWithChars, NodeWithChildren } from "@core/parser/types";
import { TextNodeWithCharsType, TextNodeWithChildrenType } from "@modules/text-parser/enums";

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
export type ComponentNode = NodeWithChars<TextNodeWithCharsType.COMPONENT, { parsed: string[] }>;
export type EmbedNode = NodeWithChars<TextNodeWithCharsType.EMBED, { href: string; contentType: EmbedContentType }>;
