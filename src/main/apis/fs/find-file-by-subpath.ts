import type { FileMetadata, Folder, IFile } from "./types"

import { getFile } from "./get-file"

export const findFileBySubPath = async (
	subPath: string,
	tree: Folder | FileMetadata,
): Promise<IFile | null> => {
	if (tree.isFile) {
		if (tree.path.endsWith(subPath)) {
			const body = await getFile(tree.path)
			return {
				...(tree as unknown as FileMetadata),
				body,
			}
		}

		return null
	}

	let found: IFile

	for (const child of (tree as Folder).children) {
		if (found) {
			break
		}

		found = await findFileBySubPath(subPath, child)
	}

	return found
}
