import { isFile } from "../../../global-context/init"
import { OrdoFile, OrdoFolder } from "../../../global-context/types"
import { getFileContent } from "./get-file-content"

export async function findFileBySubPath(
	subPath: string,
	tree: OrdoFolder | OrdoFile,
): Promise<OrdoFile> {
	if (isFile(tree)) {
		if (tree.path.endsWith(subPath)) {
			return getFileContent(tree.path)
		}

		return null
	}

	let found: OrdoFile

	for (const child of tree.children) {
		if (found && isFile(child)) {
			break
		}

		found = await findFileBySubPath(subPath, child)
	}

	return found
}
