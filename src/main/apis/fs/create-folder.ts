import type { ArbitraryFolder } from "../../../global-context/types"

import { promises } from "fs"
import { join } from "path"

export async function createFolder(folder: ArbitraryFolder, name: string): Promise<string> {
	const path = join(folder.path, name)
	return promises.mkdir(path, { recursive: true })
}
