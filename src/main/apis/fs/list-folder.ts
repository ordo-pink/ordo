import { promises } from "fs"
import { join } from "path"

import { sortTree } from "../../../utils/tree"
import { createOrdoFile, createOrdoFolder } from "../../../global-context/init"
import { OrdoFolder } from "../../../global-context/types"

export async function listFolder(
	path: string,
	depth = 0,
	parent: string = null,
): Promise<OrdoFolder> {
	const folder = await promises.readdir(path, { withFileTypes: true, encoding: "utf-8" })
	const { mtime, atime, birthtime } = await promises.stat(path)

	const tree = createOrdoFolder({ path, mtime, atime, birthtime, parent, depth, exists: true })

	for (const item of folder) {
		const newPath = join(path, item.name)

		if (item.isDirectory()) {
			const isHiddenDirectory = item.name.slice(item.name.lastIndexOf("/") + 1).startsWith(".")

			if (isHiddenDirectory) {
				continue
			}

			tree.children.push(await listFolder(newPath, depth + 1, tree.path))
		} else if (item.isFile()) {
			const { birthtime, mtime, atime, size } = await promises.stat(newPath)

			const file = createOrdoFile({
				path: newPath,
				birthtime,
				mtime,
				atime,
				size,
				depth: depth + 1,
				parent: tree.path,
				exists: true,
			})

			tree.children.push(file)
		}
	}

	return sortTree(tree)
}
