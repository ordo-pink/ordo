import type { ArbitraryFolder } from "../../../global-context/types"

import { join } from "path"
import { promises } from "fs"

export async function createFile(folder: ArbitraryFolder, name: string): Promise<void> {
	let path: string

	if (name.startsWith("/")) {
		path = name
	} else {
		path = join(folder.path, name)
	}

	const folders = path.slice(0, path.lastIndexOf("/"))

	return promises
		.stat(folders)
		.catch(() => promises.mkdir(folders, { recursive: true }))
		.then(() => promises.writeFile(path, "\n"))
}
