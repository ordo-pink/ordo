import type { OrdoFile, OrdoFolder } from "../../../global-context/types"

import { join } from "path"
import { promises } from "fs"
import { createOrdoFile } from "../../../global-context/init"

export async function createFile(parent: OrdoFolder, name: string): Promise<OrdoFile> {
	let path: string

	if (name.startsWith("/")) {
		path = name
	} else {
		path = join(parent.path, name)
	}

	await promises.writeFile(path, "\n")

	const { mtime, atime, birthtime, size } = await promises.stat(path)
	return createOrdoFile({ path, mtime, atime, birthtime, size, parent: parent.path, exists: true })
}
