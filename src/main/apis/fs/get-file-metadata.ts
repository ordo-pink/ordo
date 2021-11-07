import { readFile, stat } from "fs"
import YAML from "yaml"
import { remark } from "remark"
import remarkFrontmatter from "remark-frontmatter"
import remarkHtml from "remark-html"

import { IFile, FileMetadata } from "./types"

const mdParser = remark().use(remarkFrontmatter, ["yaml", "toml"]).use(remarkHtml)

const appendBody = (page: FileMetadata, body: string): IFile => ({
	...page,
	body,
})

export const getFileMetadata = (file: string, withBody = false): Promise<FileMetadata | IFile> =>
	new Promise((resolve, reject) => {
		readFile(file, { encoding: "utf8" }, (err, data) => {
			if (err) {
				reject(err)
			}

			stat(file, async (err, stats) => {
				if (err) {
					reject(err)
				}

				const result = await mdParser.parse(data)

				let frontmatter

				try {
					frontmatter = YAML.parse((result.children[0] as any).value)
				} catch (_) {
					frontmatter = {}
				}

				const readableName = file.split("/").reverse()[0].replace(".md", "")

				const output: FileMetadata = {
					readableName,
					createdAt: stats.birthtime,
					updatedAt: stats.mtime,
					accessedAt: stats.atime,
					size: stats.size,
					path: file,
					frontmatter,
					isFile: true,
					isFolder: false,
				}

				resolve(withBody ? appendBody(output, data) : output)
			})
		})
	})
