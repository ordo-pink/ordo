import { FileMetadata, Folder } from "../main/apis/fs/types"

export const reduce = <T>(
	reducer: (acc: T, v: FileMetadata) => T,
	accumulator: T,
	tree: Folder,
): T =>
	tree.children.reduce(
		(acc, item) =>
			item.isFolder ? reduce(reducer, acc, item) : reducer(acc, item as FileMetadata),
		accumulator,
	)

export const hasUnsavedFiles = (tree: Folder, unsavedFiles: string[]): boolean =>
	tree.isFolder && tree.children
		? tree.children.some((item) =>
				item.isFolder ? hasUnsavedFiles(item, unsavedFiles) : unsavedFiles.includes(item.path),
		  )
		: false

export const hasCurrentlyOpenedFile = (tree: Folder, path: string): boolean =>
	tree.isFolder && tree.children
		? tree.children.some((item) =>
				item.isFolder ? hasCurrentlyOpenedFile(item, path) : item.path === path,
		  )
		: false

export const findFileByPath = (tree: Folder, path: string): FileMetadata => {
	if (tree.isFile) {
		return tree.path === path ? (tree as any) : null
	}

	for (const child of tree.children) {
		if (child.isFolder) {
			const found = findFileByName(child, path)

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

export const findFileByName = (tree: Folder, name: string): FileMetadata | null => {
	if (tree.isFile) {
		return tree.readableName === name ? (tree as any) : null
	}

	for (const child of tree.children) {
		if (child.isFolder) {
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
