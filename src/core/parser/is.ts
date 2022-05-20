import { Node, DocumentRoot, NodeWithChildren, Char, NodeWithChars } from "./types";

export const isDocumentRoot = (x: Node): x is DocumentRoot => {
	return x.type === "root";
};

export const isNodeWithChildren = (x: Node & { children?: Node[] }): x is NodeWithChildren => {
	return Boolean(x.children) && Array.isArray(x.children);
};

export const isNodeWithChars = (x: Node & { chars?: Char[] }): x is NodeWithChars => {
	return Boolean(x.chars) && Array.isArray(x.chars);
};
