import { AstNode, AstNodeType, DocumentNode } from "./types"

export function createNode<T extends AstNodeType>(
	type: T,
	start: number,
	end: number,
	raw: string,
	depth: number,
	content?: AstNode[],
): AstNode<T> {
	return {
		type,
		raw,
		id: start,
		start,
		end,
		depth,
		content,
	}
}

export function createDocumentNode(
	start: number,
	end: number,
	raw: string,
	depth: number,
	content: AstNode[] = [],
): DocumentNode {
	return {
		...createNode(AstNodeType.DOCUMENT, start, end, raw, depth, content),
		frontmatter: {},
	}
}

export function createParagraphNode(
	start: number,
	end: number,
	raw: string,
	depth: number,
	content: AstNode[] = [],
): AstNode<AstNodeType.PARAGRAPH> {
	return createNode(AstNodeType.PARAGRAPH, start, end, raw, depth, content)
}

export function createBlockquoteNode(
	start: number,
	end: number,
	raw: string,
	depth: number,
	content: AstNode[] = [],
): AstNode<AstNodeType.BLOCKQUOTE> {
	return createNode(AstNodeType.BLOCKQUOTE, start, end, raw, depth, content)
}

export function createFencedCodeBlockNode(
	start: number,
	end: number,
	raw: string,
	depth: number,
	content: AstNode[] = [],
): AstNode<AstNodeType.FENCED_CODE_BLOCK> {
	return createNode(AstNodeType.FENCED_CODE_BLOCK, start, end, raw, depth, content)
}

export function createEmbeddedWikiLinkNode(
	start: number,
	end: number,
	raw: string,
	depth: number,
	content: AstNode[] = [],
): AstNode<AstNodeType.EMBEDDED_WIKI_LINK> {
	return createNode(AstNodeType.EMBEDDED_WIKI_LINK, start, end, raw, depth, content)
}

export function createEmbeddedMarkdownLinkNode(
	start: number,
	end: number,
	raw: string,
	depth: number,
	content: AstNode[] = [],
): AstNode<AstNodeType.EMBEDDED_MARKDOWN_LINK> {
	return createNode(AstNodeType.EMBEDDED_MARKDOWN_LINK, start, end, raw, depth, content)
}

export function createEmbeddedComponentLinkNode(
	start: number,
	end: number,
	raw: string,
	depth: number,
	content: AstNode[] = [],
): AstNode<AstNodeType.EMBEDDED_COMPONENT> {
	return createNode(AstNodeType.EMBEDDED_COMPONENT, start, end, raw, depth, content)
}

export function createTableNode(
	start: number,
	end: number,
	raw: string,
	depth: number,
	content: AstNode[] = [],
): AstNode<AstNodeType.TABLE> {
	return createNode(AstNodeType.TABLE, start, end, raw, depth, content)
}

export function createOrderedListNode(
	start: number,
	end: number,
	raw: string,
	depth: number,
	content: AstNode[] = [],
): AstNode<AstNodeType.ORDERED_LIST> {
	return createNode(AstNodeType.ORDERED_LIST, start, end, raw, depth, content)
}

export function createUnorderedListNode(
	start: number,
	end: number,
	raw: string,
	depth: number,
	content: AstNode[] = [],
): AstNode<AstNodeType.UNORDERED_LIST> {
	return createNode(AstNodeType.UNORDERED_LIST, start, end, raw, depth, content)
}

export function createFootnoteNode(
	start: number,
	end: number,
	raw: string,
	depth: number,
	content: AstNode[] = [],
): AstNode<AstNodeType.FOOTNOTE> {
	return createNode(AstNodeType.FOOTNOTE, start, end, raw, depth, content)
}

export function createDividerNode(
	start: number,
	end: number,
	raw: string,
	depth: number,
	content: AstNode[] = [],
): AstNode<AstNodeType.HORIZONTAL_RULE> {
	return createNode(AstNodeType.HORIZONTAL_RULE, start, end, raw, depth, content)
}

export function createHeading1Node(
	start: number,
	end: number,
	raw: string,
	depth: number,
	content: AstNode[] = [],
): AstNode<AstNodeType.HEADING_1> {
	return createNode(AstNodeType.HEADING_1, start, end, raw, depth, content)
}

export function createHeading2Node(
	start: number,
	end: number,
	raw: string,
	depth: number,
	content: AstNode[] = [],
): AstNode<AstNodeType.HEADING_2> {
	return createNode(AstNodeType.HEADING_2, start, end, raw, depth, content)
}

export function createHeading3Node(
	start: number,
	end: number,
	raw: string,
	depth: number,
	content: AstNode[] = [],
): AstNode<AstNodeType.HEADING_3> {
	return createNode(AstNodeType.HEADING_3, start, end, raw, depth, content)
}

export function createHeading4Node(
	start: number,
	end: number,
	raw: string,
	depth: number,
	content: AstNode[] = [],
): AstNode<AstNodeType.HEADING_4> {
	return createNode(AstNodeType.HEADING_4, start, end, raw, depth, content)
}

export function createHeading5Node(
	start: number,
	end: number,
	raw: string,
	depth: number,
	content: AstNode[] = [],
): AstNode<AstNodeType.HEADING_5> {
	return createNode(AstNodeType.HEADING_5, start, end, raw, depth, content)
}

// --------------

export function createTextNode(
	start: number,
	end: number,
	raw: string,
	content: AstNode[] = [],
): AstNode<AstNodeType.TEXT> {
	return createNode(AstNodeType.TEXT, start, end, raw, 0, content)
}

export function createBoldTextNode(
	start: number,
	end: number,
	raw: string,
	content: AstNode[] = [],
): AstNode<AstNodeType.TEXT_BOLD> {
	return createNode(AstNodeType.TEXT_BOLD, start, end, raw, 0, content)
}

export function createCodeTextNode(
	start: number,
	end: number,
	raw: string,
	content: AstNode[] = [],
): AstNode<AstNodeType.TEXT_CODE> {
	return createNode(AstNodeType.TEXT_CODE, start, end, raw, 0, content)
}

export function createItalicTextNode(
	start: number,
	end: number,
	raw: string,
	content: AstNode[] = [],
): AstNode<AstNodeType.TEXT_ITALIC> {
	return createNode(AstNodeType.TEXT_ITALIC, start, end, raw, 0, content)
}
