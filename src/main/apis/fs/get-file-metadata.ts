import { readFile, stat } from "fs"
import YAML from "yaml"

import { IFile, FileMetadata } from "./types"

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

				let frontmatter

				if (data.startsWith("---")) {
					try {
						const frontmatterText = data.split("---\n")[1].replace(/\t/g, "  ")
						frontmatter = YAML.parse(frontmatterText)
					} catch (e) {
						frontmatter = {}
					}
				} else {
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
