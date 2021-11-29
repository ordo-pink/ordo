import type { OrdoFolder } from "../../../global-context/types"

import { promises } from "fs"
import { join } from "path"
import { createOrdoFolder } from "../../../global-context/init"

export async function createFolder(folder: OrdoFolder, name: string): Promise<OrdoFolder> {
	const path = join(folder.path, name)
	await promises.mkdir(path, { recursive: true })
	const { birthtime, atime, mtime } = await promises.stat(path)

	return createOrdoFolder({ path, birthtime, atime, mtime, parent: folder.path, exists: true })
}
