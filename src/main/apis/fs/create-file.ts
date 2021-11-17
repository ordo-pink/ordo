import type { FileMetadata, Folder } from "./types"

import { join } from "path"
import { promises } from "fs"
import { getFileMetadata } from "./get-file-metadata"

export const createFile = (folder: Folder, name: string): Promise<FileMetadata> => {
	const path = join(folder.path, `${name}.md`)
	return promises.writeFile(path, `\n`).then(() => getFileMetadata(path))
}
