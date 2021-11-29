import { promises } from "fs"
import { createOrdoFile } from "../../../global-context/init"
import { Path, OrdoFile, WithBody } from "../../../global-context/types"

export async function getFileContent(path: Path): Promise<WithBody<OrdoFile>> {
	const body = await promises.readFile(path, "utf-8")
	const { mtime, atime, birthtime, size } = await promises.stat(path)
	const arbitraryFile = createOrdoFile({ path, mtime, atime, birthtime, size, exists: true })

	return {
		...arbitraryFile,
		body,
	}
}
