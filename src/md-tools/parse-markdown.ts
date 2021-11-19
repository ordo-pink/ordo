import type {
	AstToken,
	AstNode,
	ValueType,
	TextNode,
	TextBoldNode,
	TextCodeNode,
	TextItalicNode,
	TextStrikethroughNode,
} from "./types"

import { Pipe } from "or-pipets"
import { Switch } from "or-else"

import { AstNodeType, AstTokenType } from "./types"

function createToken(value: string, index: number) {
	return function (type: AstTokenType): AstToken {
		return {
			type,
			index,
			value,
		}
	}
}

function createNode<T extends AstNodeType>(
	type: T,
	start: number,
	end: number,
	children: AstNode[] = [],
): AstNode<T> {
	return {
		type,
		start,
		end,
		children,
	}
}

function createTextNode(
	start: number,
	end: number,
	value: ValueType<AstNodeType.TEXT>,
	children: AstNode[] = [],
): TextNode {
	return { ...createNode(AstNodeType.TEXT, start, end, children), [AstNodeType.TEXT]: value }
}

function createTextCodeNode(
	start: number,
	end: number,
	value: ValueType<AstNodeType.TEXT>,
	children: AstNode[] = [],
): TextCodeNode {
	return {
		...createNode(AstNodeType.TEXT_CODE, start, end, children),
		[AstNodeType.TEXT_CODE]: value,
	}
}

function createTextBoldNode(
	start: number,
	end: number,
	value: ValueType<AstNodeType.TEXT>,
	children: AstNode[] = [],
): TextBoldNode {
	return {
		...createNode(AstNodeType.TEXT_BOLD, start, end, children),
		[AstNodeType.TEXT_BOLD]: value,
	}
}

function createTextItalicNode(
	start: number,
	end: number,
	value: ValueType<AstNodeType.TEXT>,
	children: AstNode[] = [],
): TextItalicNode {
	return {
		...createNode(AstNodeType.TEXT_ITALIC, start, end, children),
		[AstNodeType.TEXT_ITALIC]: value,
	}
}

function createTextStrikethroughNode(
	start: number,
	end: number,
	value: ValueType<AstNodeType.TEXT>,
	children: AstNode[] = [],
): TextStrikethroughNode {
	return {
		...createNode(AstNodeType.TEXT_STRIKETHROUGH, start, end, children),
		[AstNodeType.TEXT_STRIKETHROUGH]: value,
	}
}

const isTab = (x: string) => x === "\t"
const isWhiteSpace = (x: string) => x === " "
const isHash = (x: string) => x === "#"
const isHyphen = (x: string) => x === "-"
const isUnderscore = (x: string) => x === "_"
const isTilde = (x: string) => x === "~"
const isPlus = (x: string) => x === "+"
const isStar = (x: string) => x === "*"
const isAt = (x: string) => x === "@"
const isChevronLeft = (x: string) => x === "<"
const isChevronRight = (x: string) => x === ">"
const isOpenSquareBracket = (x: string) => x === "["
const isCloseSquareBracket = (x: string) => x === "]"
const isBacktick = (x: string) => x === "`"
const isExclamation = (x: string) => x === "!"
const isOpenBrace = (x: string) => x === "["
const isCloseBrace = (x: string) => x === "]"
const isEquals = (x: string) => x === "="
const isQuote = (x: string) => x === "'"
const isDoubleQuote = (x: string) => x === '"'
const isEOL = (x: string) => x === "\n"
const isNumber = (x: string) => /\d/.test(x)

export function tokenizeMarkdown(body: string): AstToken[] {
	let position = 0

	const tokens: AstToken[] = []

	while (position < body.length) {
		const currentChar = body[position]
		const tokenize = Pipe.of(createToken(currentChar, position)).pipe((token) => tokens.push(token))

		const register = Switch.of(currentChar)
			.case(isTab, () => tokenize.process(AstTokenType.TAB))
			.case(isWhiteSpace, () => tokenize.process(AstTokenType.WHITESPACE))
			.case(isHash, () => tokenize.process(AstTokenType.HASH))
			.case(isHyphen, () => tokenize.process(AstTokenType.HYPHEN))
			.case(isUnderscore, () => tokenize.process(AstTokenType.UNDERSCORE))
			.case(isTilde, () => tokenize.process(AstTokenType.TILDE))
			.case(isPlus, () => tokenize.process(AstTokenType.PLUS))
			.case(isStar, () => tokenize.process(AstTokenType.STAR))
			.case(isAt, () => tokenize.process(AstTokenType.AT))
			.case(isChevronLeft, () => tokenize.process(AstTokenType.CHEVRON_LEFT))
			.case(isChevronRight, () => tokenize.process(AstTokenType.CHEVRON_RIGHT))
			.case(isOpenSquareBracket, () => tokenize.process(AstTokenType.OPEN_SQUARE_BRACKET))
			.case(isCloseSquareBracket, () => tokenize.process(AstTokenType.CLOSE_SQUARE_BRACKET))
			.case(isBacktick, () => tokenize.process(AstTokenType.BACKTICK))
			.case(isExclamation, () => tokenize.process(AstTokenType.EXCLAMATION))
			.case(isOpenBrace, () => tokenize.process(AstTokenType.OPEN_BRACE))
			.case(isCloseBrace, () => tokenize.process(AstTokenType.CLOSE_BRACE))
			.case(isEquals, () => tokenize.process(AstTokenType.EQUALS))
			.case(isQuote, () => tokenize.process(AstTokenType.QUOTE))
			.case(isDoubleQuote, () => tokenize.process(AstTokenType.DOUBLE_QUOTE))
			.case(isNumber, () => tokenize.process(AstTokenType.NUMBER))
			.case(isEOL, () => tokenize.process(AstTokenType.EOL))
			.default(() => tokenize.process(AstTokenType.CHAR))

		register()

		position++
	}

	tokens.push(createToken("", body.length)(AstTokenType.EOF))

	return tokens
}

function getToken(tokens: AstToken[], index: number): AstToken {
	return tokens[index]
}

function getNextToken(tokens: AstToken[]) {
	let index = 0
	return function (): AstToken {
		const token = getToken(tokens, index)
		index++

		return token
	}
}

function parseInline(tokens: AstToken[], ast: AstNode): AstNode {
	const next = getNextToken(tokens)

	let token = next()

	const start = token.index
	let end: number

	while (token && tokens.indexOf(token) < tokens.length) {
		if (token.type === AstTokenType.BACKTICK) {
			const chars = []

			chars.push(token.value)

			token = next()

			while (token && token.type !== AstTokenType.BACKTICK) {
				end = token.index
				chars.push(token.value)

				token = next()
			}

			if (token) {
				chars.push(token.value)
				token = next()
				ast.children.push(createTextCodeNode(start, end, { content: chars.join("") }))
			} else {
				token = next()
				ast.children.push(createTextNode(start, end, { content: chars.join("") }))
			}
		} else if (token.type === AstTokenType.TILDE) {
			const nextToken = getToken(tokens, tokens.indexOf(token) + 1)
			const chars = []

			if (nextToken && nextToken.type === AstTokenType.TILDE) {
				chars.push(token.value)
				token = next()
				chars.push(token.value)
				token = next()

				while (token && token.type !== AstTokenType.TILDE) {
					end = token.index
					chars.push(token.value)

					token = next()
				}

				if (token) {
					chars.push(token.value)
					token = next()

					if (token) {
						chars.push(token.value)
						token = next()

						ast.children.push(createTextStrikethroughNode(start, end, { content: chars.join("") }))

						continue
					}
				}

				token = next()
				ast.children.push(createTextCodeNode(start, end, { content: chars.join("") }))
			} else {
				token = next()
				ast.children.push(createTextCodeNode(start, end, { content: "~" }))
			}
		} else if (token.type === AstTokenType.STAR) {
			const nextToken = getToken(tokens, tokens.indexOf(token) + 1)
			const chars = []

			if (nextToken && nextToken.type === AstTokenType.STAR) {
				chars.push(token.value)
				token = next()
				chars.push(token.value)
				token = next()

				while (token && token.type !== AstTokenType.STAR) {
					end = token.index
					chars.push(token.value)

					token = next()
				}

				if (token) {
					chars.push(token.value)
					token = next()

					if (token) {
						chars.push(token.value)
						token = next()

						ast.children.push(createTextBoldNode(start, end, { content: chars.join("") }))

						continue
					}
				}

				token = next()
				ast.children.push(createTextCodeNode(start, end, { content: chars.join("") }))
			} else if (nextToken && nextToken.type !== AstTokenType.STAR) {
				const chars = []

				chars.push(token.value)
				token = next()

				while (token && token.type !== AstTokenType.STAR) {
					end = token.index
					chars.push(token.value)

					token = next()
				}

				if (token) {
					chars.push(token.value)
					token = next()

					ast.children.push(createTextItalicNode(start, end, { content: chars.join("") }))

					continue
				}

				token = next()
				ast.children.push(createTextCodeNode(start, end, { content: chars.join("") }))
			}
		} else if (token.type === AstTokenType.UNDERSCORE) {
			const nextToken = getToken(tokens, tokens.indexOf(token) + 1)
			const chars = []

			if (nextToken && nextToken.type === AstTokenType.UNDERSCORE) {
				chars.push(token.value)
				token = next()
				chars.push(token.value)
				token = next()

				while (token && token.type !== AstTokenType.UNDERSCORE) {
					end = token.index
					chars.push(token.value)

					token = next()
				}

				if (token) {
					chars.push(token.value)
					token = next()

					if (token) {
						chars.push(token.value)
						token = next()

						ast.children.push(createTextBoldNode(start, end, { content: chars.join("") }))

						continue
					}
				}

				token = next()
				ast.children.push(createTextCodeNode(start, end, { content: chars.join("") }))
			} else if (nextToken && nextToken.type !== AstTokenType.UNDERSCORE) {
				const chars = []

				chars.push(token.value)
				token = next()

				while (token && token.type !== AstTokenType.UNDERSCORE) {
					end = token.index
					chars.push(token.value)

					token = next()
				}

				if (token) {
					chars.push(token.value)
					token = next()

					ast.children.push(createTextItalicNode(start, end, { content: chars.join("") }))

					continue
				}

				token = next()
				ast.children.push(createTextCodeNode(start, end, { content: chars.join("") }))
			}
		} else {
			const chars = []

			while (
				token &&
				token.type !== AstTokenType.BACKTICK &&
				token.type !== AstTokenType.TILDE &&
				token.type !== AstTokenType.STAR &&
				token.type !== AstTokenType.UNDERSCORE
			) {
				end = token.index
				chars.push(token.value)

				token = next()
			}

			token = next()
			ast.children.push(createTextNode(start, end, { content: chars.join("") }))
		}
	}

	return ast
}

export function parse(
	tokens: AstToken[],
	ast = createNode(AstNodeType.DOCUMENT, 0, tokens.length),
): AstNode {
	const next = getNextToken(tokens)

	let token = next()
	let lastTokenIndex = token.index

	while (token && token.index < tokens.length) {
		const previousToken = getToken(tokens, token.index - 1)

		if (
			token.type === AstTokenType.HASH &&
			(token.index === 0 || !previousToken || previousToken.type === AstTokenType.EOL)
		) {
			const firstTokenIndex = token.index
			const nodeTokens = []

			let depth = 0

			while (token && token.type === AstTokenType.HASH && depth < 5) {
				depth++
				token = next()
			}

			if (token && token.type === AstTokenType.WHITESPACE) {
				let backwardIndex = token.index - 1

				const nodeType = Switch.of(depth)
					.case(2, AstNodeType.HEADING_2)
					.case(3, AstNodeType.HEADING_3)
					.case(4, AstNodeType.HEADING_4)
					.case(5, AstNodeType.HEADING_5)
					.default(AstNodeType.HEADING_1)

				while (depth > 0) {
					nodeTokens.push(getToken(tokens, backwardIndex))
					depth--
					backwardIndex--
				}

				while (token.type !== AstTokenType.EOL && token.type !== AstTokenType.EOF) {
					nodeTokens.push(token)
					token = next()
					lastTokenIndex = token.index
				}

				ast.children.push(
					parseInline(nodeTokens, createNode(nodeType, firstTokenIndex, lastTokenIndex + 1)),
				)

				token = next()
			} else {
				let backwardIndex = token.index - 1

				while (depth > 0) {
					nodeTokens.push(getToken(tokens, backwardIndex))
					depth--
					backwardIndex--
				}

				while (token && token.type !== AstTokenType.EOL && token.type !== AstTokenType.EOF) {
					lastTokenIndex = token.index
					nodeTokens.push(token)

					token = next()
				}

				ast.children.push(
					parseInline(
						nodeTokens,
						createNode(AstNodeType.PARAGRAPH, firstTokenIndex, lastTokenIndex + 1),
					),
				)

				token = next()
			}
		} else if (
			token.type === AstTokenType.CHEVRON_RIGHT &&
			(token.index === 0 || !previousToken || previousToken.type === AstTokenType.EOL)
		) {
			const firstTokenIndex = token.index
			const nodeTokens = []

			while (token.type !== AstTokenType.EOL && token.type !== AstTokenType.EOF) {
				nodeTokens.push(token)
				token = next()
				lastTokenIndex = token.index
			}

			ast.children.push(
				parseInline(
					nodeTokens,
					createNode(AstNodeType.BLOCKQUOTE, firstTokenIndex, lastTokenIndex + 1),
				),
			)

			token = next()
		} else if (token && (token.type === AstTokenType.EOL || token.type === AstTokenType.EOF)) {
			ast.children.push(
				parseInline([token], createNode(AstNodeType.PARAGRAPH, token.index, token.index + 1)),
			)
			token = next()
		} else {
			const firstTokenIndex = token.index
			const nodeTokens = []

			while (token && token.type !== AstTokenType.EOL && token.type !== AstTokenType.EOF) {
				lastTokenIndex = token.index
				nodeTokens.push(token)

				token = next()
			}

			ast.children.push(
				parseInline(
					nodeTokens,
					createNode(AstNodeType.PARAGRAPH, firstTokenIndex, lastTokenIndex + 1),
				),
			)

			token = next()
		}
	}

	return ast
}
