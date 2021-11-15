export type MarkdownTree = {
	raw?: string
	index?: number
	nodeType?: NodeType
	content?: JSX.Element
	children: MarkdownTree[]
}

export enum NodeType {
	HEADING_1,
	HEADING_2,
	HEADING_3,
	HEADING_4,
	HEADING_5,
	QUOTE,
	ORDERED_LIST,
	UNORDERED_LIST,
	LIST_ITEM,
	PARAGRAPH,
	EMPTY_LINE,
	INDENTATION,
	TEXT_CODE,
	TEXT_STRIKETHROUGH,
	TEXT_BOLD,
	TEXT_ITALIC,
	TEXT_UNDERLINED,
	LINK,
	EMBEDDED_LINK,
	CODE_SNIPPET,
	TABLE,
	EMBEDDABLE_COMPONENT,
}

export const createTree = (markdown: string): MarkdownTree => {
	const result: MarkdownTree = {
		children: [],
	}

	const lines = markdown.split("\n")

	lines.forEach((line, index) => {
		line.split("").reduce(
			(tree, char, charIndex) => {
				if (/\t/.test(char) && charIndex === 0) {
					tree.children.push({
						nodeType: NodeType.INDENTATION,
						raw: char,
						index: charIndex,
						children: [],
					})
				}

				return tree
			},
			{ children: [], raw: line, index },
		)
	})

	return result
}
