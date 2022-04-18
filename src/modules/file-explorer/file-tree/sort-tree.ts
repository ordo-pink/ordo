import { OrdoFile, OrdoFolder } from "@modules/editor/editor-slice";

const isFolder = (x: OrdoFile | OrdoFolder): x is OrdoFolder => x.type === "folder";

export const sortTree = (tree: OrdoFolder): OrdoFolder => {
	tree.children = tree.children.sort((a, b) => {
		if (isFolder(a)) {
			sortTree(a);
		}

		if (isFolder(b)) {
			sortTree(b);
		}

		if (!isFolder(a) && isFolder(b)) {
			return 1;
		}

		if (isFolder(a) && !isFolder(b)) {
			return -1;
		}

		return a.readableName.localeCompare(b.readableName);
	});

	return tree as OrdoFolder;
};
