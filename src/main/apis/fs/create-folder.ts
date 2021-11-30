import type { OrdoFolder } from "../../../global-context/types"

import { promises } from "fs"
import { join } from "path"
import { createOrdoFolder } from "../../../global-context/init"

export async function createFolder(parent: OrdoFolder, name: string): Promise<OrdoFolder> {
	const path = join(parent.path, name)
	await promises.mkdir(path, { recursive: true })
	const { birthtime, atime, mtime } = await promises.stat(path)

	return createOrdoFolder({
		path,
		birthtime,
		atime,
		mtime,
		parent: parent.path,
		depth: parent.depth + 1,
		exists: true,
	})
}
