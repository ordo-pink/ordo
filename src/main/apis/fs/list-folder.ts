import { promises } from "fs"
import { join } from "path"
import {
	createArbitraryFolder,
	createMDFolder,
	createMDFolderFrontmatter,
	isFolder,
} from "../../../global-context/init"
import { ArbitraryFolder } from "../../../global-context/types"
import { getMarkdownFile } from "./get-markdown-file"

const sortTree = (tree: ArbitraryFolder) => {
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

export async function listFolder(path: string): Promise<ArbitraryFolder> {
	const folder = await promises.readdir(path, { withFileTypes: true, encoding: "utf-8" })
	const stats = await promises.stat(path)

	let tree = createArbitraryFolder(path, stats)

	for (const item of folder) {
		const newPath = join(path, item.name)
		if (item.isDirectory()) {
			if (item.name.slice(item.name.lastIndexOf("/") + 1).startsWith(".")) {
				continue
			}

			tree.children.push(await listFolder(newPath))
		} else if (item.isFile() && item.name.endsWith(".md")) {
			const mdFile = await getMarkdownFile(newPath)

			if (item.name === ".folder-metadata.md") {
				tree = createMDFolder(tree, createMDFolderFrontmatter(mdFile.frontmatter))
			} else {
				tree.children.push(mdFile)
			}
		}
	}

	return sortTree(tree)
}
