import { isFile } from "../../../global-context/init"
import { ArbitraryFile, ArbitraryFolder } from "../../../global-context/types"
import { getFileContent } from "./get-file-content"

export async function findFileBySubPath(
	subPath: string,
	tree: ArbitraryFolder | ArbitraryFile,
): Promise<ArbitraryFile> {
	if (isFile(tree)) {
		if (tree.path.endsWith(subPath)) {
			return getFileContent(tree.path)
		}

		return null
	}

	let found: ArbitraryFile

	for (const child of tree.children) {
		if (found) {
			break
		}

		found = await findFileBySubPath(subPath, child)
	}

	return found
}
