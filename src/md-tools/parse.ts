import YAML from "yaml"

import { AstToken, AstNode, AstTokenType, DocumentNode, AstNodeType } from "./types"
import {
	createBlockquoteNode,
	createDividerNode,
	createDocumentNode,
	createEmbeddedComponentLinkNode,
	createEmbeddedWikiLinkNode,
	createFencedCodeBlockNode,
	createHeading1Node,
	createHeading2Node,
	createHeading3Node,
	createHeading4Node,
	createHeading5Node,
	createOrderedListNode,
	createParagraphNode,
	createUnorderedListNode,
} from "./create-node"
import { parseInline } from "./parse-inline"
import {
	getNextTokenSet,
	hasNext,
	hasNext2,
	hasNext3,
	hasNext4,
	hasNext5,
	hasPrev,
	isFirstLine,
	isLineStart,
} from "./tokenise"

export function parseMarkdown(
	tokens: AstToken[],
	ast: AstNode = createDocumentNode(
		0,
		tokens[tokens.length - 1].index,
		tokens.map((t) => t.value).join(""),
		0,
	),
): AstNode {
	const next = getNextTokenSet(tokens)

	let tokenSet = next()

	let depth = 0

	while (tokenSet.token) {
		const isFrontmatter =
			ast.type === AstNodeType.DOCUMENT &&
			isLineStart(tokenSet) &&
			!hasPrev(tokenSet) &&
			hasNext(tokenSet) &&
			hasNext2(tokenSet) &&
			hasNext3(tokenSet) &&
			tokenSet.token.type === AstTokenType.HYPHEN &&
			tokenSet.nextToken.type === AstTokenType.HYPHEN &&
			tokenSet.nextToken2.type === AstTokenType.HYPHEN &&
			tokenSet.nextToken3.type === AstTokenType.EOL

		const isEmbeddedComponent =
			isLineStart(tokenSet) &&
			hasNext(tokenSet) &&
			tokenSet.token.type === AstTokenType.CHEVRON_LEFT &&
			tokenSet.nextToken.type === AstTokenType.TEXT &&
			tokenSet.nextToken.value[0] === tokenSet.nextToken.value[0].toUpperCase()

		const isOrderedList =
			isLineStart(tokenSet) &&
			hasNext(tokenSet) &&
			hasNext2(tokenSet) &&
			tokenSet.token.type === AstTokenType.NUMBER &&
			tokenSet.nextToken.type === AstTokenType.DOT &&
			tokenSet.nextToken2.type === AstTokenType.WHITESPACE

		const isUnorderedList =
			isLineStart(tokenSet) &&
			hasNext(tokenSet) &&
			tokenSet.token.type === AstTokenType.STAR &&
			tokenSet.nextToken.type === AstTokenType.WHITESPACE

		const isHyphenUnorderedList =
			isLineStart(tokenSet) &&
			hasNext(tokenSet) &&
			tokenSet.token.type === AstTokenType.HYPHEN &&
			tokenSet.nextToken.type === AstTokenType.WHITESPACE

		const isHorizontalRule =
			isLineStart(tokenSet) &&
			hasNext(tokenSet) &&
			hasNext2(tokenSet) &&
			hasNext3(tokenSet) &&
			tokenSet.token.type === AstTokenType.HYPHEN &&
			tokenSet.nextToken.type === AstTokenType.HYPHEN &&
			tokenSet.nextToken2.type === AstTokenType.HYPHEN &&
			tokenSet.nextToken3.type === AstTokenType.EOL

		const isFencedCodeBlock =
			isLineStart(tokenSet) &&
			hasNext(tokenSet) &&
			hasNext2(tokenSet) &&
			tokenSet.token.type === AstTokenType.BACKTICK &&
			tokenSet.nextToken.type === AstTokenType.BACKTICK &&
			tokenSet.nextToken2.type === AstTokenType.BACKTICK

		const isEmbeddedWikiLink =
			isLineStart(tokenSet) &&
			hasNext(tokenSet) &&
			hasNext2(tokenSet) &&
			tokenSet.token.type === AstTokenType.EXCLAMATION &&
			tokenSet.nextToken.type === AstTokenType.OPEN_SQUARE_BRACKET &&
			tokenSet.nextToken2.type === AstTokenType.OPEN_SQUARE_BRACKET

		const isBlockquote =
			isLineStart(tokenSet) &&
			hasNext(tokenSet) &&
			tokenSet.token.type === AstTokenType.CHEVRON_RIGHT &&
			tokenSet.nextToken.type === AstTokenType.WHITESPACE

		const isHeading1 =
			isLineStart(tokenSet) &&
			hasNext(tokenSet) &&
			tokenSet.token.type === AstTokenType.HASH &&
			tokenSet.nextToken.type === AstTokenType.WHITESPACE

		const isHeading2 =
			isLineStart(tokenSet) &&
			hasNext(tokenSet) &&
			hasNext2(tokenSet) &&
			tokenSet.token.type === AstTokenType.HASH &&
			tokenSet.nextToken.type === AstTokenType.HASH &&
			tokenSet.nextToken2.type === AstTokenType.WHITESPACE

		const isHeading3 =
			isLineStart(tokenSet) &&
			hasNext(tokenSet) &&
			hasNext2(tokenSet) &&
			hasNext3(tokenSet) &&
			tokenSet.token.type === AstTokenType.HASH &&
			tokenSet.nextToken.type === AstTokenType.HASH &&
			tokenSet.nextToken2.type === AstTokenType.HASH &&
			tokenSet.nextToken3.type === AstTokenType.WHITESPACE

		const isHeading4 =
			isLineStart(tokenSet) &&
			hasNext(tokenSet) &&
			hasNext2(tokenSet) &&
			hasNext3(tokenSet) &&
			hasNext4(tokenSet) &&
			tokenSet.token.type === AstTokenType.HASH &&
			tokenSet.nextToken.type === AstTokenType.HASH &&
			tokenSet.nextToken2.type === AstTokenType.HASH &&
			tokenSet.nextToken3.type === AstTokenType.HASH &&
			tokenSet.nextToken4.type === AstTokenType.WHITESPACE

		const isHeading5 =
			isLineStart(tokenSet) &&
			hasNext(tokenSet) &&
			hasNext2(tokenSet) &&
			hasNext3(tokenSet) &&
			hasNext4(tokenSet) &&
			hasNext5(tokenSet) &&
			tokenSet.token.type === AstTokenType.HASH &&
			tokenSet.nextToken.type === AstTokenType.HASH &&
			tokenSet.nextToken2.type === AstTokenType.HASH &&
			tokenSet.nextToken3.type === AstTokenType.HASH &&
			tokenSet.nextToken4.type === AstTokenType.HASH &&
			tokenSet.nextToken5.type === AstTokenType.WHITESPACE

		const isParagraph = isLineStart

		if (isLineStart(tokenSet) && tokenSet.token.type === AstTokenType.TAB) {
			while (tokenSet.token.type === AstTokenType.TAB) {
				depth++

				tokenSet = next()
			}
		} else if (tokenSet.token.type === AstTokenType.EOF) {
			if (
				isFirstLine(tokenSet) ||
				(hasPrev(tokenSet) && tokenSet.prevToken.type === AstTokenType.EOL)
			) {
				ast.content.push(createParagraphNode(tokenSet.token.index, tokenSet.token.index, "", depth))
			}

			return ast
		} else if (isFrontmatter) {
			const preservedTokens: AstToken[] = []

			preservedTokens.push(tokenSet.token)
			tokenSet = next()
			preservedTokens.push(tokenSet.token)
			tokenSet = next()
			preservedTokens.push(tokenSet.token)
			tokenSet = next()

			while (
				tokenSet.token &&
				hasNext(tokenSet) &&
				hasNext2(tokenSet) &&
				hasNext3(tokenSet) &&
				hasNext4(tokenSet)
			) {
				if (
					tokenSet.token.type === AstTokenType.HYPHEN &&
					tokenSet.nextToken.type === AstTokenType.HYPHEN &&
					tokenSet.nextToken2.type === AstTokenType.HYPHEN &&
					tokenSet.nextToken3.type === AstTokenType.EOL
				) {
					break
				}

				if (tokenSet.token.type === AstTokenType.TAB) {
					tokenSet.token.value = "  "
				}

				preservedTokens.push(tokenSet.token)
				tokenSet = next()
			}

			preservedTokens.push(tokenSet.token)
			tokenSet = next()
			preservedTokens.push(tokenSet.token)
			tokenSet = next()
			preservedTokens.push(tokenSet.token)
			tokenSet = next()
			preservedTokens.push(tokenSet.token)
			tokenSet = next()

			let frontmatterContent

			try {
				frontmatterContent = YAML.parse(
					preservedTokens
						.slice(3, -4)
						.map((t) => t.value)
						.join(""),
				)
			} catch (e) {
				frontmatterContent = {}
			}

			// ;(ast as DocumentNode).frontmatter = frontmatterContent
		} else if (isHorizontalRule) {
			const preservedTokens: AstToken[] = []

			while (
				tokenSet.token &&
				tokenSet.token.type !== AstTokenType.EOL &&
				tokenSet.token.type !== AstTokenType.EOF
			) {
				preservedTokens.push(tokenSet.token)
				tokenSet = next()
			}

			preservedTokens.push(tokenSet.token)
			tokenSet = next()

			const tree = createDividerNode(
				preservedTokens[0].index,
				preservedTokens[preservedTokens.length - 1].index,
				preservedTokens.map((t) => t.value).join(""),
				depth,
			)

			depth = 0

			ast.content.push(tree)
		} else if (isFencedCodeBlock) {
			const preservedTokens: AstToken[] = []

			preservedTokens.push(tokenSet.token)
			tokenSet = next()
			preservedTokens.push(tokenSet.token)
			tokenSet = next()
			preservedTokens.push(tokenSet.token)
			tokenSet = next()

			while (tokenSet.token && hasNext(tokenSet) && hasNext2(tokenSet)) {
				if (
					tokenSet.token.type === AstTokenType.BACKTICK &&
					tokenSet.nextToken.type === AstTokenType.BACKTICK &&
					tokenSet.nextToken2.type === AstTokenType.BACKTICK
				) {
					break
				}

				preservedTokens.push(tokenSet.token)
				tokenSet = next()
			}

			// TODO: Extracting language and removing \n when passed inside inline parse

			preservedTokens.push(tokenSet.token)
			tokenSet = next()
			preservedTokens.push(tokenSet.token)
			tokenSet = next()
			preservedTokens.push(tokenSet.token)
			tokenSet = next()
			preservedTokens.push(tokenSet.token)
			tokenSet = next()

			const tree = createFencedCodeBlockNode(
				preservedTokens[0].index,
				preservedTokens[preservedTokens.length - 1].index,
				preservedTokens.map((t) => t.value).join(""),
				depth,
			)

			depth = 0

			ast.content.push(parseInline(preservedTokens.slice(3, -4), tree))
		} else if (isBlockquote) {
			const preservedTokens: AstToken[] = []

			while (
				tokenSet.token &&
				tokenSet.token.type !== AstTokenType.EOL &&
				tokenSet.token.type !== AstTokenType.EOF
			) {
				preservedTokens.push(tokenSet.token)
				tokenSet = next()
			}

			preservedTokens.push(tokenSet.token)
			tokenSet = next()

			const tree = createBlockquoteNode(
				preservedTokens[0].index,
				preservedTokens[preservedTokens.length - 1].index,
				preservedTokens.map((t) => t.value).join(""),
				depth,
			)

			depth = 0

			ast.content.push(parseInline(preservedTokens.slice(2), tree))
		} else if (isUnorderedList || isHyphenUnorderedList) {
			const preservedTokens: AstToken[] = []

			while (
				tokenSet.token &&
				tokenSet.token.type !== AstTokenType.EOL &&
				tokenSet.token.type !== AstTokenType.EOF
			) {
				preservedTokens.push(tokenSet.token)
				tokenSet = next()
			}

			preservedTokens.push(tokenSet.token)
			tokenSet = next()

			const tree = createUnorderedListNode(
				preservedTokens[0].index,
				preservedTokens[preservedTokens.length - 1].index,
				preservedTokens.map((t) => t.value).join(""),
				depth,
			)

			depth = 0

			ast.content.push(parseInline(preservedTokens.slice(2), tree))
		} else if (isOrderedList) {
			const preservedTokens: AstToken[] = []

			while (
				tokenSet.token &&
				tokenSet.token.type !== AstTokenType.EOL &&
				tokenSet.token.type !== AstTokenType.EOF
			) {
				preservedTokens.push(tokenSet.token)
				tokenSet = next()
			}

			preservedTokens.push(tokenSet.token)
			tokenSet = next()

			const tree = createOrderedListNode(
				preservedTokens[0].index,
				preservedTokens[preservedTokens.length - 1].index,
				preservedTokens.map((t) => t.value).join(""),
				depth,
			)

			depth = 0

			ast.content.push(parseInline(preservedTokens.slice(3), tree))
		} else if (isEmbeddedComponent) {
			const preservedTokens: AstToken[] = []

			while (
				tokenSet.token &&
				tokenSet.token.type !== AstTokenType.EOL &&
				tokenSet.token.type !== AstTokenType.EOF
			) {
				preservedTokens.push(tokenSet.token)
				tokenSet = next()
			}

			preservedTokens.push(tokenSet.token)
			tokenSet = next()

			const tree = createEmbeddedComponentLinkNode(
				preservedTokens[0].index,
				preservedTokens[preservedTokens.length - 1].index,
				preservedTokens.map((t) => t.value).join(""),
				depth,
			)

			depth = 0

			ast.content.push(parseInline(preservedTokens, tree))
		} else if (isEmbeddedWikiLink) {
			const preservedTokens: AstToken[] = []

			while (
				tokenSet.token &&
				tokenSet.token.type !== AstTokenType.EOL &&
				tokenSet.token.type !== AstTokenType.EOF
			) {
				preservedTokens.push(tokenSet.token)
				tokenSet = next()
			}

			preservedTokens.push(tokenSet.token)
			tokenSet = next()

			const tree = createEmbeddedWikiLinkNode(
				preservedTokens[0].index,
				preservedTokens[preservedTokens.length - 1].index,
				preservedTokens.map((t) => t.value).join(""),
				depth,
			)

			depth = 0

			ast.content.push(parseInline(preservedTokens.slice(3, -3), tree))
		} else if (isHeading1) {
			const preservedTokens: AstToken[] = []

			while (
				tokenSet.token &&
				tokenSet.token.type !== AstTokenType.EOL &&
				tokenSet.token.type !== AstTokenType.EOF
			) {
				preservedTokens.push(tokenSet.token)
				tokenSet = next()
			}

			preservedTokens.push(tokenSet.token)
			tokenSet = next()

			const tree = createHeading1Node(
				preservedTokens[0].index,
				preservedTokens[preservedTokens.length - 1].index,
				preservedTokens.map((t) => t.value).join(""),
				depth,
			)

			depth = 0

			ast.content.push(parseInline(preservedTokens.slice(2), tree))
		} else if (isHeading2) {
			const preservedTokens: AstToken[] = []

			while (
				tokenSet.token &&
				tokenSet.token.type !== AstTokenType.EOL &&
				tokenSet.token.type !== AstTokenType.EOF
			) {
				preservedTokens.push(tokenSet.token)
				tokenSet = next()
			}

			preservedTokens.push(tokenSet.token)
			tokenSet = next()

			const tree = createHeading2Node(
				preservedTokens[0].index,
				preservedTokens[preservedTokens.length - 1].index,
				preservedTokens.map((t) => t.value).join(""),
				depth,
			)

			depth = 0

			ast.content.push(parseInline(preservedTokens.slice(3), tree))
		} else if (isHeading3) {
			const preservedTokens: AstToken[] = []

			while (
				tokenSet.token &&
				tokenSet.token.type !== AstTokenType.EOL &&
				tokenSet.token.type !== AstTokenType.EOF
			) {
				preservedTokens.push(tokenSet.token)
				tokenSet = next()
			}

			preservedTokens.push(tokenSet.token)
			tokenSet = next()

			const tree = createHeading3Node(
				preservedTokens[0].index,
				preservedTokens[preservedTokens.length - 1].index,
				preservedTokens.map((t) => t.value).join(""),
				depth,
			)

			depth = 0

			ast.content.push(parseInline(preservedTokens.slice(4), tree))
		} else if (isHeading4) {
			const preservedTokens: AstToken[] = []

			while (
				tokenSet.token &&
				tokenSet.token.type !== AstTokenType.EOL &&
				tokenSet.token.type !== AstTokenType.EOF
			) {
				preservedTokens.push(tokenSet.token)
				tokenSet = next()
			}

			preservedTokens.push(tokenSet.token)
			tokenSet = next()

			const tree = createHeading4Node(
				preservedTokens[0].index,
				preservedTokens[preservedTokens.length - 1].index,
				preservedTokens.map((t) => t.value).join(""),
				depth,
			)

			depth = 0

			ast.content.push(parseInline(preservedTokens.slice(5), tree))
		} else if (isHeading5) {
			const preservedTokens: AstToken[] = []

			while (
				tokenSet.token &&
				tokenSet.token.type !== AstTokenType.EOL &&
				tokenSet.token.type !== AstTokenType.EOF
			) {
				preservedTokens.push(tokenSet.token)
				tokenSet = next()
			}

			preservedTokens.push(tokenSet.token)
			tokenSet = next()

			const tree = createHeading5Node(
				preservedTokens[0].index,
				preservedTokens[preservedTokens.length - 1].index,
				preservedTokens.map((t) => t.value).join(""),
				depth,
			)

			depth = 0

			ast.content.push(parseInline(preservedTokens.slice(6), tree))
		} else if (isParagraph) {
			const preservedTokens: AstToken[] = []

			while (
				tokenSet.token &&
				tokenSet.token.type !== AstTokenType.EOL &&
				tokenSet.token.type !== AstTokenType.EOF
			) {
				preservedTokens.push(tokenSet.token)
				tokenSet = next()
			}

			preservedTokens.push(tokenSet.token)
			tokenSet = next()

			const tree = createParagraphNode(
				preservedTokens[0].index,
				preservedTokens[preservedTokens.length - 1].index,
				preservedTokens.map((t) => t.value).join(""),
				depth,
			)

			depth = 0

			ast.content.push(parseInline(preservedTokens, tree))
		}
	}

	return ast
}
