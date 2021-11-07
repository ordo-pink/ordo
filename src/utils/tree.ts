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

export const findFile = (tree: Folder, path: string): FileMetadata =>
	tree.children.find((item) =>
		item.isFolder ? findFile(tree, path) : item.path === path,
	) as FileMetadata
