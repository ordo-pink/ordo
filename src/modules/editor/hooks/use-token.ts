import { Either } from "or-else";

import { Location, Token, TokenWithChildren } from "@modules/md-parser/types";
import { useCurrentTab } from "./use-current-tab";

const check = (tree: Token, startPosition: Location) =>
	tree.position.start.character === startPosition.character && tree.position.start.line === startPosition.line;

const findToken = (tree: TokenWithChildren, startPosition: Location): Token | null => {
	if (check(tree, startPosition)) {
		return tree;
	}

	for (const child of tree.children) {
		if (check(child, startPosition)) {
			return child;
		}

		if ((child as TokenWithChildren).children) {
			const found = findToken(child as TokenWithChildren, startPosition);

			if (found) {
				return found;
			}
		}
	}

	return null;
};

export const useToken = (lineIndex: number, startPosition: Location) => {
	const { tab } = useCurrentTab();

	const line = tab && tab.parsed.children[lineIndex];

	return line ? findToken(line as TokenWithChildren, startPosition) : null;
};
