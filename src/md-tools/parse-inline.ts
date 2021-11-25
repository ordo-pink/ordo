import { createLinkNode, createTagNode, createTextNode } from "./create-node"
import { getNextTokenSet, hasNext } from "./tokenise"
import { AstToken, AstNode, AstTokenType } from "./types"

export function parseInline(tokens: AstToken[], ast: AstNode): AstNode {
	const next = getNextTokenSet(tokens)

	let tokenSet = next()

	while (tokenSet.token && tokenSet.token.type !== AstTokenType.EOF) {
		if (
			tokenSet.token &&
			hasNext(tokenSet) &&
			tokenSet.token.type === AstTokenType.HASH &&
			tokenSet.nextToken.type !== AstTokenType.WHITESPACE &&
			tokenSet.nextToken.type !== AstTokenType.EOL &&
			tokenSet.nextToken.type !== AstTokenType.EOF
		) {
			const preservedTokens: AstToken[] = []

			while (
				tokenSet.token &&
				tokenSet.token.type !== AstTokenType.EOF &&
				tokenSet.token.type !== AstTokenType.EOL &&
				tokenSet.token.type !== AstTokenType.WHITESPACE
			) {
				preservedTokens.push(tokenSet.token)
				tokenSet = next()
			}

			const tree = createTagNode(
				preservedTokens[0].index,
				preservedTokens[preservedTokens.length - 1].index,
				preservedTokens.map((t) => t.value).join(""),
			)

			ast.content.push(tree)

			tokenSet = next()
		} else if (
			tokenSet.token &&
			hasNext(tokenSet) &&
			tokenSet.token.type === AstTokenType.OPEN_SQUARE_BRACKET &&
			tokenSet.nextToken.type === AstTokenType.OPEN_SQUARE_BRACKET
		) {
			const preservedTokens: AstToken[] = []

			while (
				tokenSet.token &&
				tokenSet.token.type !== AstTokenType.EOF &&
				tokenSet.token.type !== AstTokenType.EOL
			) {
				if (
					tokenSet.token.type === AstTokenType.CLOSE_SQUARE_BRACKET &&
					tokenSet.nextToken.type === AstTokenType.CLOSE_SQUARE_BRACKET
				) {
					break
				}

				preservedTokens.push(tokenSet.token)
				tokenSet = next()
			}

			preservedTokens.push(tokenSet.token)
			tokenSet = next()
			preservedTokens.push(tokenSet.token)
			tokenSet = next()

			const tree = createLinkNode(
				preservedTokens[0].index,
				preservedTokens[preservedTokens.length - 1].index,
				preservedTokens.map((t) => t.value).join(""),
			)

			ast.content.push(tree)

			tokenSet = next()
		} else {
			const preservedTokens: AstToken[] = []

			while (tokenSet.token && tokenSet.token.type !== AstTokenType.EOF) {
				preservedTokens.push(tokenSet.token)
				tokenSet = next()
			}

			const tree = createTextNode(
				preservedTokens[0].index,
				preservedTokens[preservedTokens.length - 1].index,
				preservedTokens.map((t) => t.value).join(""),
			)

			ast.content.push(tree)

			tokenSet = next()
		}
	}

	return ast
}
