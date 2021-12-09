import { OrdoFolder, OrdoEntity } from "../types";
import { getParent } from "./get-parent";

export const getAncestors = (tree: OrdoFolder, node: OrdoEntity): OrdoFolder[] => {
	const ancestors = [];

	let currentNode = node;

	while (currentNode) {
		currentNode = getParent(tree, currentNode);

		if (currentNode) {
			ancestors.push(currentNode);
		}
	}

	return ancestors;
};
