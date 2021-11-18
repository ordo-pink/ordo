import { isFolder } from "../global-context/init"
import type { ArbitraryFolder, MDFile } from "../global-context/types"

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
