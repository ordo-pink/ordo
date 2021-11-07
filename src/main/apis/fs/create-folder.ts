import { mkdir, writeFile } from "fs"
import { join } from "path"

const folderMetadataContent = (path: string) => `---
---
color: default
collapsed: true
---

<List folder="${path}" />
`

export const createFolder = (path: string): Promise<string> =>
	new Promise((resolve, reject) =>
		mkdir(path, { recursive: true }, (err, path) => {
			if (err) {
				reject(err)
			}

			writeFile(join(path, ".folder-metadata.md"), folderMetadataContent(path), (err) => {
				if (err) {
					reject(err)
				}

				resolve(path)
			})
		}),
	)
