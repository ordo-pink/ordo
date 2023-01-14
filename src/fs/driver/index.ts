import { OrdoDirectoryPath, FSDriver } from "$core/types"

import { createDirectory } from "$fs/driver/methods/create-directory"
import { createFile } from "$fs/driver/methods/create-file"

export const createDefaultFSDriver = (directory: OrdoDirectoryPath): FSDriver => ({
  createDirectory: createDirectory(directory),
  createFile: createFile(directory),
  getDirectory: () => void 0 as any,
  getFile: () => void 0 as any,
  moveDirectory: () => void 0 as any,
  moveFile: () => void 0 as any,
  removeDirectory: () => void 0 as any,
  removeFile: () => void 0 as any,
  updateFile: () => void 0 as any,
})
