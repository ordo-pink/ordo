import { AbstractOrdoFile, AbstractOrdoFolder, OrdoFolder } from "../types";
import { getParent } from "./get-parent";

export const getAncestors = (
	tree: OrdoFolder,
	node: AbstractOrdoFile | AbstractOrdoFolder,
): AbstractOrdoFolder[] => {
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
