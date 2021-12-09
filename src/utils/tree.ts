import { isFolder } from "../global-context/init";
import type { OrdoFile, OrdoFolder, MDFile } from "../global-context/types";

export function findNode<K extends keyof (OrdoFolder | OrdoFile)>(
	tree: OrdoFolder | OrdoFile,
	key: K,
	value: K extends keyof OrdoFolder ? OrdoFolder[K] : OrdoFile[K],
): OrdoFolder | OrdoFile {
	if (tree[key] === value) {
		return tree;
	}

	if (!isFolder(tree)) {
		return null;
	}

	for (const child of tree.children) {
		if (isFolder(child)) {
			const found = findNode(child, key, value);

			if (found) {
				return found;
			}
		} else {
			if (child[key] === value) {
				return child;
			}
		}
	}

	return null;
}

export function getParentNode(tree: OrdoFolder, node: OrdoFolder | OrdoFile): OrdoFolder {
	if (isFolder(tree)) {
		for (const child of tree.children) {
			if (child.path === node.path) {
				return tree;
			}

			if (isFolder(child)) {
				const found = getParentNode(child, node);

				if (found) {
					return found;
				}
			}
		}
	}

	return null;
}

export const reduce = <T>(reducer: (acc: T, v: MDFile) => T, accumulator: T, tree: OrdoFolder): T =>
	tree.children.reduce(
		(acc, item) => (isFolder(item) ? reduce(reducer, acc, item) : reducer(acc, item as MDFile)),
		accumulator,
	);

export const hasUnsavedFiles = (tree: OrdoFolder, unsavedFiles: string[]): boolean =>
	isFolder(tree) && tree.children
		? tree.children.some((item) =>
				isFolder(item) ? hasUnsavedFiles(item, unsavedFiles) : unsavedFiles.includes(item.path),
		  )
		: false;

export const hasCurrentlyOpenedFile = (tree: OrdoFolder, path: string): boolean =>
	isFolder(tree) && tree.children
		? tree.children.some((item) =>
				isFolder(item) ? hasCurrentlyOpenedFile(item, path) : item.path === path,
		  )
		: false;

export const findFileByPath = (tree: OrdoFolder, path: string): MDFile | null => {
	if (tree.isFile) {
		return tree.path === path ? (tree as any) : null;
	}

	for (const child of tree.children) {
		if (isFolder(child)) {
			const found = findFileByPath(child, path);

			if (found) {
				return found;
			}
		}

		if (child.path === path) {
			return child as any;
		}
	}

	return null;
};

export const findFileByName = (tree: OrdoFolder, name: string): MDFile | null => {
	if (tree.isFile) {
		return tree.readableName === name ? (tree as any) : null;
	}

	for (const child of tree.children) {
		if (isFolder(child)) {
			const found = findFileByName(child, name);

			if (found) {
				return found;
			}
		}

		if (child.readableName === name) {
			return child as any;
		}
	}

	return null;
};
