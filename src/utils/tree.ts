import { isFolder } from "../global-context/init"
import type { ArbitraryFile, ArbitraryFolder, MDFile } from "../global-context/types"

export interface FSTree<TLeaf = any> extends Record<string, unknown> {
	children: Array<FSTree<TLeaf> | TLeaf>
}

export function findNode<K extends keyof (ArbitraryFolder | ArbitraryFile)>(
	tree: ArbitraryFolder | ArbitraryFile,
	key: K,
	value: K extends keyof ArbitraryFolder ? ArbitraryFolder[K] : ArbitraryFile[K],
): ArbitraryFolder | ArbitraryFile {
	if (tree[key] === value) {
		return tree
	}

	if (!isFolder(tree)) {
		return null
	}

	for (const child of tree.children) {
		if (isFolder(child)) {
			const found = findNode(child, key, value)

			if (found) {
				return found
			}
		} else {
			if (child[key] === value) {
				return child
			}
		}
	}

	return null
}

export function getParentNode(
	tree: ArbitraryFolder,
	node: ArbitraryFolder | ArbitraryFile,
): ArbitraryFolder {
	if (isFolder(tree)) {
		for (const child of tree.children) {
			if (child.path === node.path) {
				return tree
			}

			if (isFolder(child)) {
				const found = getParentNode(child, node)

				if (found) {
					return found
				}
			}
		}
	}

	return null
}

export const sortTree = (tree: ArbitraryFolder): ArbitraryFolder => {
	tree.children = tree.children.sort((a, b) => {
		if (isFolder(a)) {
			sortTree(a)
		}

		if (isFolder(b)) {
			sortTree(b)
		}

		if (!isFolder(a) && isFolder(b)) {
			return 1
		}

		if (isFolder(a) && !isFolder(b)) {
			return -1
		}

		return a.readableName.localeCompare(b.readableName)
	})

	return tree
}

export const reduce = <T>(
	reducer: (acc: T, v: MDFile) => T,
	accumulator: T,
	tree: ArbitraryFolder,
): T =>
	tree.children.reduce(
		(acc, item) => (isFolder(item) ? reduce(reducer, acc, item) : reducer(acc, item as MDFile)),
		accumulator,
	)

export const hasUnsavedFiles = (tree: ArbitraryFolder, unsavedFiles: string[]): boolean =>
	isFolder(tree) && tree.children
		? tree.children.some((item) =>
				isFolder(item) ? hasUnsavedFiles(item, unsavedFiles) : unsavedFiles.includes(item.path),
		  )
		: false

export const hasCurrentlyOpenedFile = (tree: ArbitraryFolder, path: string): boolean =>
	isFolder(tree) && tree.children
		? tree.children.some((item) =>
				isFolder(item) ? hasCurrentlyOpenedFile(item, path) : item.path === path,
		  )
		: false

export const findFileByPath = (tree: ArbitraryFolder, path: string): MDFile | null => {
	if (tree.isFile) {
		return tree.path === path ? (tree as any) : null
	}

	for (const child of tree.children) {
		if (isFolder(child)) {
			const found = findFileByPath(child, path)

			if (found) {
				return found
			}
		}

		if (child.path === path) {
			return child as any
		}
	}

	return null
}

export const findFileByName = (tree: ArbitraryFolder, name: string): MDFile | null => {
	if (tree.isFile) {
		return tree.readableName === name ? (tree as any) : null
	}

	for (const child of tree.children) {
		if (isFolder(child)) {
			const found = findFileByName(child, name)

			if (found) {
				return found
			}
		}

		if (child.readableName === name) {
			return child as any
		}
	}

	return null
}
