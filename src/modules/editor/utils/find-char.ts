import { Char, Node } from "@core/parser/types";
import { isNodeWithChildren, isNodeWithChars } from "@core/parser/is";

export const findChar = (tree: Node, line: number, character: number): Char | null => {
	if (isNodeWithChildren(tree)) {
		for (const child of tree.children) {
			const found = findChar(child, line, character);
			if (found) {
				return found;
			}
		}
	} else if (isNodeWithChars(tree)) {
		return tree.chars.find((char) => char.position.line === line && char.position.character === character) ?? null;
	}

	return null;
};
