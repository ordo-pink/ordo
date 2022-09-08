import { Node, DocumentRoot, NodeWithChildren, Char, NodeWithChars } from "@core/parser/types";

/**
 * Check if provided argument is a Node.
 */
export const isNode = (x: unknown): x is Node => {
  return typeof x === "object" && x != null && (x as any).type != null;
};

/**
 * Check if provided node is a root node.
 */
export const isDocumentRoot = (x: Node): x is DocumentRoot => {
  return isNode(x) && x.type === "root";
};

/**
 * Check if provided node is a node with children.
 */
export const isNodeWithChildren = (x: Node & { children?: Node[] }): x is NodeWithChildren => {
  return isNode(x) && Boolean(x.children) && Array.isArray(x.children);
};

/**
 * Check if provided node is a node with chars.
 */
export const isNodeWithChars = (x: Node & { chars?: Char[] }): x is NodeWithChars => {
  return isNode(x) && Boolean(x.chars) && Array.isArray(x.chars);
};
