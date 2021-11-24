import type { AstToken } from "./types"

import { Pipe } from "or-pipets"
import { Switch } from "or-else"

import { AstTokenType } from "./types"

export type AstTokenSet = {
	prevToken?: AstToken
	token: AstToken
	nextToken: AstToken
	nextToken2: AstToken
	nextToken3: AstToken
	nextToken4: AstToken
	nextToken5: AstToken
}

export function getToken(tokens: AstToken[], index: number): AstToken {
	return tokens[index]
}

export function getNextTokenSet(tokens: AstToken[]): () => AstTokenSet {
	let index = 0

	return function (): AstTokenSet {
		const token = getToken(tokens, index)

		const prevToken = index === 0 ? undefined : getToken(tokens, index - 1)

		const nextToken = getToken(tokens, index + 1)
		const nextToken2 = getToken(tokens, index + 2)
		const nextToken3 = getToken(tokens, index + 3)
		const nextToken4 = getToken(tokens, index + 4)
		const nextToken5 = getToken(tokens, index + 5)

		index++

		return {
			prevToken,
			token,
			nextToken,
			nextToken2,
			nextToken3,
			nextToken4,
			nextToken5,
		}
	}
}

export const isFirstLine = (tokenSet: AstTokenSet): boolean => !tokenSet.prevToken
export const isLineStart = (tokenSet: AstTokenSet): boolean =>
	(tokenSet.prevToken && tokenSet.prevToken.type === AstTokenType.EOL) ||
	(tokenSet.prevToken && tokenSet.prevToken.type === AstTokenType.TAB) ||
	isFirstLine(tokenSet)
export const hasPrev = (tokenSet: AstTokenSet): boolean => Boolean(tokenSet.prevToken)
export const hasNext = (tokenSet: AstTokenSet): boolean => Boolean(tokenSet.nextToken)
export const hasNext2 = (tokenSet: AstTokenSet): boolean => Boolean(tokenSet.nextToken2)
export const hasNext3 = (tokenSet: AstTokenSet): boolean => Boolean(tokenSet.nextToken3)
export const hasNext4 = (tokenSet: AstTokenSet): boolean => Boolean(tokenSet.nextToken4)
export const hasNext5 = (tokenSet: AstTokenSet): boolean => Boolean(tokenSet.nextToken5)

function createToken(value: string, index: number) {
	return function (type: AstTokenType): AstToken {
		return {
			type,
			index,
			value,
		}
	}
}

const isTab = (x: string) => x === "\t"
const isWhiteSpace = (x: string) => /\s/.test(x)
const isSlash = (x: string) => x === "/"
const isHash = (x: string) => x === "#"
const isHyphen = (x: string) => x === "-"
const isUnderscore = (x: string) => x === "_"
const isTilde = (x: string) => x === "~"
const isPlus = (x: string) => x === "+"
const isStar = (x: string) => x === "*"
const isAt = (x: string) => x === "@"
const isDot = (x: string) => x === "."
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
const isEOL = (x: string) => /\n/.test(x)
const isNumber = (x: string) => /\d/.test(x)

export function tokenizeMarkdown(body: string): AstToken[] {
	let position = 0
	let charArray: string[] = []

	const tokens: AstToken[] = []

	while (position < body.length) {
		const currentChar = body[position]

		const tokenize = Pipe.of(createToken(currentChar, position)).pipe((token) => {
			if (charArray.length) {
				tokens.push(createToken(charArray.join(""), position - charArray.length)(AstTokenType.TEXT))
				charArray = []
			}

			tokens.push(token)
		})

		const register = Switch.of(currentChar)
			.case(isEOL, () => tokenize.process(AstTokenType.EOL))
			.case(isTab, () => tokenize.process(AstTokenType.TAB))
			.case(isWhiteSpace, () => tokenize.process(AstTokenType.WHITESPACE))
			.case(isSlash, () => tokenize.process(AstTokenType.SLASH))
			.case(isHash, () => tokenize.process(AstTokenType.HASH))
			.case(isHyphen, () => tokenize.process(AstTokenType.HYPHEN))
			.case(isUnderscore, () => tokenize.process(AstTokenType.UNDERSCORE))
			.case(isTilde, () => tokenize.process(AstTokenType.TILDE))
			.case(isPlus, () => tokenize.process(AstTokenType.PLUS))
			.case(isStar, () => tokenize.process(AstTokenType.STAR))
			.case(isDot, () => tokenize.process(AstTokenType.DOT))
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
			.default(() => {
				charArray.push(currentChar)
			})

		register()

		position++
	}

	tokens.push(createToken("", body.length)(AstTokenType.EOF))

	return tokens
}
