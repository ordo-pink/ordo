import { isNodeWithChars, isNodeWithChildren } from "@core/parser/is";
import { Node, NodeWithChars, NodeWithChildren } from "@core/parser/types";
import { TextNodeWithCharsType, TextNodeWithChildrenType } from "@modules/text-parser/enums";
import {
	BoldNode,
	CodeNode,
	ComponentNode,
	EmbedNode,
	HeadingNode,
	HrNode,
	ItalicNode,
	LinkNode,
	StrikethroughNode,
	TagNode,
	TodoNode,
} from "@modules/text-parser/types";

export const isTextNodeWithChildren = (node: Node): node is NodeWithChildren =>
	isNodeWithChildren(node) &&
	(node.type === TextNodeWithChildrenType.TOGGLE ||
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
	isNodeWithChildren(node) && node.type === TextNodeWithChildrenType.HEADING;

export const isToDoNode = (node: Node): node is TodoNode =>
	isNodeWithChildren(node) &&
	node.type === TextNodeWithChildrenType.TODO &&
	node.data != null &&
	node.data.checked != null;

export const isTagNode = (node: Node): node is TagNode =>
	isNodeWithChars(node) &&
	node.type === TextNodeWithCharsType.TAG &&
	node.data != null &&
	typeof node.data.tag === "string" &&
	node.data.tag.length > 0;

export const isBoldNode = (node: Node): node is BoldNode =>
	isNodeWithChildren(node) && node.type === TextNodeWithChildrenType.BOLD;

export const isItalicNode = (node: Node): node is ItalicNode =>
	isNodeWithChildren(node) && node.type === TextNodeWithChildrenType.ITALIC;

export const isCodeNode = (node: Node): node is CodeNode =>
	isNodeWithChildren(node) && node.type === TextNodeWithChildrenType.CODE;

export const isStrikethroughNode = (node: Node): node is StrikethroughNode =>
	isNodeWithChildren(node) && node.type === TextNodeWithChildrenType.STRIKETHROUGH;

export const isHrNode = (node: Node): node is HrNode =>
	isTextNodeWithChars(node) && node.type === TextNodeWithCharsType.HR;

export const isComponentNode = (node: Node): node is ComponentNode =>
	isTextNodeWithChars(node) &&
	node.type === TextNodeWithCharsType.COMPONENT &&
	node.data != null &&
	node.data.parsed != null &&
	Array.isArray(node.data.parsed);

export const isEmbedNode = (node: Node): node is EmbedNode =>
	isTextNodeWithChars(node) &&
	node.type === TextNodeWithCharsType.EMBED &&
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

export const isLinkNode = (node: Node): node is LinkNode =>
	isTextNodeWithChars(node) &&
	node.type === TextNodeWithCharsType.LINK &&
	node.data != null &&
	typeof node.data.href === "string" &&
	typeof node.data.contentType === "string" &&
	(node.data.contentType === "internal" || node.data.contentType === "external");
