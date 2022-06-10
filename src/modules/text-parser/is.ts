import { isNodeWithChars, isNodeWithChildren } from "@core/parser/is";
import { Node, NodeWithChars, NodeWithChildren } from "@core/parser/types";
import { TextNodeWithCharsType, TextNodeWithChildrenType } from "@modules/text-parser/enums";
import { ComponentNode, EmbedNode, HeadingNode, TodoNode } from "@modules/text-parser/types";

export const isTextNodeWithChildren = (node: Node): node is NodeWithChildren =>
	isNodeWithChildren(node) &&
	(node.type === TextNodeWithChildrenType.BLOCKQUOTE ||
		node.type === TextNodeWithChildrenType.BOLD ||
		node.type === TextNodeWithChildrenType.CODE ||
		node.type === TextNodeWithChildrenType.HEADING ||
		node.type === TextNodeWithChildrenType.ITALIC ||
		node.type === TextNodeWithChildrenType.PARAGRAPH ||
		node.type === TextNodeWithChildrenType.STRIKETHROUGH ||
		node.type === TextNodeWithChildrenType.TODO);

export const isTextNodeWithChars = (node: Node): node is NodeWithChars =>
	isNodeWithChars(node) &&
	(node.type === TextNodeWithCharsType.COMPONENT ||
		node.type === TextNodeWithCharsType.EMBED ||
		node.type === TextNodeWithCharsType.HR ||
		node.type === TextNodeWithCharsType.LINK ||
		node.type === TextNodeWithCharsType.TAG ||
		node.type === TextNodeWithCharsType.TEXT);

export const isHeadingNode = (node: Node): node is HeadingNode =>
	node.type === TextNodeWithChildrenType.HEADING && isNodeWithChildren(node);

export const isToDoNode = (node: Node): node is TodoNode =>
	node.type === TextNodeWithChildrenType.TODO &&
	isNodeWithChildren(node) &&
	node.data != null &&
	node.data.checked != null;

export const isComponentNode = (node: Node): node is ComponentNode =>
	node.type === TextNodeWithCharsType.COMPONENT &&
	isTextNodeWithChars(node) &&
	node.data != null &&
	node.data.parsed != null &&
	Array.isArray(node.data.parsed);

export const isEmbedNode = (node: Node): node is EmbedNode =>
	node.type === TextNodeWithCharsType.EMBED &&
	isTextNodeWithChars(node) &&
	node.data != null &&
	typeof node.data.href === "string" &&
	typeof node.data.contentType === "string" &&
	(node.data.contentType === "youtube" ||
		node.data.contentType === "twitter" ||
		node.data.contentType === "link" ||
		node.data.contentType === "audio" ||
		node.data.contentType === "video" ||
		node.data.contentType === "image" ||
		node.data.contentType === "document");
