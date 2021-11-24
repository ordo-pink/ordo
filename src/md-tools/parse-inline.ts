import { createTextNode } from "./create-node"
import { getNextTokenSet } from "./tokenise"
import { AstToken, AstNode, AstTokenType } from "./types"

export function parseInline(tokens: AstToken[], ast: AstNode): AstNode {
	const next = getNextTokenSet(tokens)

	let tokenSet = next()

	while (tokenSet.token && tokenSet.token.type !== AstTokenType.EOF) {
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

	return ast
}
