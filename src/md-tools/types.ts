import { FrontmatterKey, FrontmatterValue } from "../global-context/types"

export enum AstNodeType {
	DOCUMENT = "document",

	FRONTMATTER = "frontmatter",

	PARAGRAPH = "paragraph",
	HEADING_1 = "heading_1",
	HEADING_2 = "heading_2",
	HEADING_3 = "heading_3",
	HEADING_4 = "heading_4",
	HEADING_5 = "heading_5",
	BLOCKQUOTE = "blockquote",
	FENCED_CODE_BLOCK = "fenced_code_block",
	EMBEDDED_WIKI_LINK = "embedded_wiki_link",
	EMBEDDED_MARKDOWN_LINK = "embedded_markdown_link",
	EMBEDDED_COMPONENT = "embedded_component",
	TABLE = "table",
	HORIZONTAL_RULE = "horizontal_rule",
	ORDERED_LIST = "ordered_list",
	UNORDERED_LIST = "unordered_list",
	FOOTNOTE = "footnote",
	DEFINITION_LIST = "definition_list",

	TAG = "tag",
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
	TEXT,
	NUMBER,
	TAB,
	WHITESPACE,
	DOT,
	HASH,
	HYPHEN,
	TILDE,
	SLASH,
	UNDERSCORE,
	PLUS,
	EQUALS,
	STAR,
	AT,
	BACKTICK,
	OPEN_BRACE,
	CLOSE_BRACE,
	OPEN_SQUARE_BRACKET,
	CLOSE_SQUARE_BRACKET,
	CHEVRON_LEFT,
	CHEVRON_RIGHT,
	EXCLAMATION,
	QUOTE,
	DOUBLE_QUOTE,
	EOL,
	EOF,
}

export type AstNode<T extends AstNodeType = AstNodeType> = {
	id: number
	type: T
	start: number
	end: number
	raw: string
	depth?: number
	element?: JSX.Element
	content?: AstNode[]
}

export type DocumentNode = AstNode<AstNodeType.DOCUMENT> & {
	frontmatter: Record<FrontmatterKey, FrontmatterValue>
}

export type ValueType<T extends AstNodeType> = T extends AstNodeType.TEXT
	? { content: string }
	: Record<string, unknown>

export type AstToken = {
	type: AstTokenType
	index: number
	value: string
}
