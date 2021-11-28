import type { ArbitraryFolder } from "../../../global-context/types"

import { promises } from "fs"
import { join } from "path"
import { createArbitraryFolder } from "../../../global-context/init"

export async function createFolder(
	folder: ArbitraryFolder,
	name: string,
): Promise<ArbitraryFolder> {
	const path = join(folder.path, name)
	const folderPath = await promises.mkdir(path, { recursive: true })
	const stats = await promises.stat(path)

	console.log(folder)

	return createArbitraryFolder(folderPath, stats, folder)
}
