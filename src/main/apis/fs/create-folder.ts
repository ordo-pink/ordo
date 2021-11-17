import type { Folder } from "./types"

import { promises } from "fs"
import { join } from "path"
import { listFolder } from "./list-folder"

const folderMetadataContent = (path: string) => `---
color: default
---

<Kanban folder="${path}" />
`

export const createFolder = (folder: Folder, name: string): Promise<Folder> => {
	const path = join(folder.path, name)
	return promises
		.mkdir(path, { recursive: true })
		.then(() => promises.writeFile(join(path, ".folder-metadata.md"), folderMetadataContent(path)))
		.then(() => listFolder(path))
}
