import { readdir } from "fs"
import { join } from "path"
import { getColor } from "../appearance/get-color"
import { getFileMetadata } from "./get-file-metadata"
import { FileMetadata, Folder } from "./types"

const isFolder = (x: Folder | FileMetadata): x is Folder => x.isFolder

const sortTree = (tree: Folder) => {
	tree.children = tree.children.sort((a, b) => {
		if (isFolder(a)) {
			sortTree(a)
		}

		if (isFolder(b)) {
			sortTree(b)
		}

		if (!isFolder(a) && isFolder(b)) {
			return 1
		}

		if (isFolder(a) && !isFolder(b)) {
			return -1
		}

		return a.readableName.localeCompare(b.readableName)
	})

	return tree
}

export const listFolder = (path: string, tree: Folder = {} as Folder): Promise<Folder> =>
	new Promise((resolve, reject) => {
		readdir(path, { withFileTypes: true, encoding: "utf8" }, async (err, files) => {
			if (err) {
				reject(err)
			}

			if (!tree.children) {
				tree.isFile = false
				tree.isFolder = true
				tree.path = path
				tree.readableName = path.slice(path.lastIndexOf("/") + 1)
				tree.children = []
			}

			for (const fileOrFolder of files) {
				if (fileOrFolder.isFile()) {
					try {
						const fileMetadata = await getFileMetadata(join(path, fileOrFolder.name))

						if (fileOrFolder.name === ".folder-metadata.md") {
							tree.color = getColor(fileMetadata.frontmatter.color)
							tree.collapsed = fileMetadata.frontmatter.collapsed.toString() === "true"
						} else {
							tree.children.push(fileMetadata)
						}
					} catch (e) {
						return reject(e)
					}
				} else if (fileOrFolder.isDirectory()) {
					tree.children.push(await listFolder(join(path, fileOrFolder.name)))
				}
			}

			resolve(sortTree(tree))
		})
	})
