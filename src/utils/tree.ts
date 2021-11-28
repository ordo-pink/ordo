import { isFolder } from "../global-context/init"
import type { ArbitraryFile, ArbitraryFolder, MDFile } from "../global-context/types"

export interface FSTree<TLeaf = any> extends Record<string, unknown> {
	children: Array<FSTree<TLeaf> | TLeaf>
}

function isFSTreeBranch(x: { children?: unknown }): x is FSTree {
	return x && x.children && Array.isArray(x.children)
}

export function findNode<
	N extends Record<string, unknown>,
	T extends FSTree<N> = FSTree<N>,
	K extends keyof T = keyof T,
>(tree: T, key: K, value: T[K]): T | N {
	if (tree[key] === value) {
		return tree
	}

	for (const child of tree.children) {
		if (isFSTreeBranch(child)) {
			const found = findNode(child, key as keyof typeof child, value)

			if (found) {
				return found as T
			}
		} else {
			if ((child as T)[key] === value) {
				return child
			}
		}
	}

	return null
}

export function getParentNode(
	tree: ArbitraryFolder,
	node: ArbitraryFolder | ArbitraryFile,
): ArbitraryFolder | ArbitraryFile {
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

// TODO: Deprecate

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
