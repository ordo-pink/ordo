import { AstNode, AstNodeType } from "./types"

export function visit(tree: AstNode) {
	return function (type: AstNodeType, callback: (node: AstNode) => void): void {
		if (tree.type === type) {
			callback(tree)
		}

		if (tree.content && tree.content.length) {
			for (const child of tree.content) {
				visit(child)(type, callback)
			}
		}
	}
}
