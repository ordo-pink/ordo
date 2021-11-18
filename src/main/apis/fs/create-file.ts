import type { ArbitraryFolder } from "../../../global-context/types"

import { join } from "path"
import { promises } from "fs"

export async function createFile(folder: ArbitraryFolder, name: string): Promise<void> {
	const path = join(folder.path, name)
	return promises.writeFile(path, `\n`)
}
