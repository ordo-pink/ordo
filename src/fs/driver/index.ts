import { DirectoryPath, FSDriver } from "$core/types"

import { createDirectory } from "$fs/driver/methods/create-directory"

export const createFsServer = (directory: DirectoryPath): FSDriver => ({
  createDirectory: createDirectory(directory),
  createFile: () => void 0 as any,
  getDirectory: () => void 0 as any,
  getFile: () => void 0 as any,
  moveDirectory: () => void 0 as any,
  moveFile: () => void 0 as any,
  removeDirectory: () => void 0 as any,
  removeFile: () => void 0 as any,
  updateFile: () => void 0 as any,
})
