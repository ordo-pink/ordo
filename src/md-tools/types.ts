export enum AstNodeType {
	DOCUMENT = "document", // v
	PARAGRAPH = "paragraph", // v
	HEADING_1 = "heading_1", // v
	HEADING_2 = "heading_2", // v
	HEADING_3 = "heading_3", // v
	HEADING_4 = "heading_4", // v
	HEADING_5 = "heading_5", // v
	BLOCKQUOTE = "blockquote", // v
	FENCED_CODE_BLOCK = "fenced_code_block",
	EMBEDDED_WIKI_LINK = "embedded_wiki_link",
	EMBEDDED_MARKDOWN_LINK = "embedded_markdown_link",
	EMBEDDED_COMPONENT = "embedded_component",
	TABLE = "table",
	HORIZONTAL_RULE = "horizontal_rule",
	ORDERED_LIST = "ordered_list",
	UNORDERED_LIST = "unordered_list",
	FOOTNOTE = "footnote",

	FRONTMATTER = "frontmatter",

	DEFINITION_LIST = "definition_list",
	TASK_LIST = "task_list",
	LIST_ITEM = "list_item",
	HEADING_ID = "heading_id",
	TEXT = "text",
	TEXT_BOLD = "text_bold",
	TEXT_ITALIC = "text_italic",
	TEXT_STRIKETHROUGH = "text_strikethrough",
	TEXT_CODE = "text_code",
	MARKDOWN_LINK = "markdown_link",
	WIKI_LINK = "wiki_link",
	FOOTNOTE_LINK = "footnote_link",
}

export enum AstTokenType {
	CHAR = "character",
	NUMBER = "number",
	TAB = "tab",
	WHITESPACE = "whitespace",
	HASH = "#",
	HYPHEN = "-",
	TILDE = "~",
	UNDERSCORE = "_",
	PLUS = "+",
	EQUALS = "=",
	STAR = "*",
	AT = "@",
	BACKTICK = "`",
	OPEN_BRACE = "(",
	CLOSE_BRACE = ")",
	OPEN_SQUARE_BRACKET = "[",
	CLOSE_SQUARE_BRACKET = "]",
	CHEVRON_LEFT = "<",
	CHEVRON_RIGHT = ">",
	EXCLAMATION = "!",
	QUOTE = "'",
	DOUBLE_QUOTE = '"',
	EOL = "EOL",
	EOF = "EOF",
}

export type AstNode<T extends AstNodeType = AstNodeType> = {
	type: T
	start: number
	end: number
	children: AstNode[]
	element?: JSX.Element
}

export type MarkdownAST = AstNode<AstNodeType.DOCUMENT>

export type TextNode = AstNode<AstNodeType.TEXT> & {
	[AstNodeType.TEXT]: ValueType<AstNodeType.TEXT>
}

export type TextBoldNode = AstNode<AstNodeType.TEXT_BOLD> & {
	[AstNodeType.TEXT_BOLD]: ValueType<AstNodeType.TEXT_BOLD>
}
export type TextItalicNode = AstNode<AstNodeType.TEXT_ITALIC> & {
	[AstNodeType.TEXT_ITALIC]: ValueType<AstNodeType.TEXT_ITALIC>
}
export type TextStrikethroughNode = AstNode<AstNodeType.TEXT_STRIKETHROUGH> & {
	[AstNodeType.TEXT_STRIKETHROUGH]: ValueType<AstNodeType.TEXT_STRIKETHROUGH>
}

export type TextCodeNode = AstNode<AstNodeType.TEXT_CODE> & {
	[AstNodeType.TEXT_CODE]: ValueType<AstNodeType.TEXT_CODE>
}

export type ValueType<T extends AstNodeType> = T extends AstNodeType.TEXT
	? { content: string }
	: Record<string, unknown>

export type AstToken = {
	type: AstTokenType
	index: number
	value: string
}
