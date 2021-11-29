import { promises } from "fs"
import { createArbitraryFile } from "../../../global-context/init"
import { Path, ArbitraryFile, WithBody } from "../../../global-context/types"

export async function getFileContent(path: Path): Promise<WithBody<ArbitraryFile>> {
	const body = await promises.readFile(path, "utf-8")
	const { mtime, atime, birthtime, size } = await promises.stat(path)
	const arbitraryFile = createArbitraryFile({ path, mtime, atime, birthtime, size })

	return {
		...arbitraryFile,
		body,
	}
}
