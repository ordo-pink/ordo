import type { ArbitraryFile, ArbitraryFolder } from "../../../global-context/types"

import { join } from "path"
import { promises } from "fs"
import { createArbitraryFolder, createArbitraryFile } from "../../../global-context/init"

export async function createFile(folder: ArbitraryFolder, name: string): Promise<ArbitraryFile> {
	let path: string

	if (name.startsWith("/")) {
		path = name
	} else {
		path = join(folder.path, name)
	}

	const parentNodePath = path.slice(0, path.lastIndexOf("/"))

	let parentNodeStat
	let file

	try {
		parentNodeStat = await promises.stat(parentNodePath)

		await promises.writeFile(path, "\n")

		const fileStats = await promises.stat(path)
		file = createArbitraryFile(path, fileStats, folder)
	} catch (e) {
		await promises.mkdir(parentNodePath, { recursive: true })
		parentNodeStat = await promises.stat(parentNodePath)

		const parentNode = createArbitraryFolder(parentNodePath, parentNodeStat, folder)

		await promises.writeFile(path, "\n")

		const fileStats = await promises.stat(path)
		file = createArbitraryFile(path, fileStats, parentNode)

		folder.children.push(parentNode)
	}

	return file
}
