import { FSDriver } from "$core/types"

import { createDirectory } from "$fs/driver/methods/create-directory"
import { createFile } from "$fs/driver/methods/create-file"
import { getDirectory } from "$fs/driver/methods/get-directory"

export const createDefaultFSDriver = (rootDirectory: string): FSDriver => {
  const normalizedDirectory = rootDirectory.replaceAll("\\", "/")

  return {
    createDirectory: createDirectory(normalizedDirectory),
    createFile: createFile(normalizedDirectory),
    getDirectory: getDirectory(normalizedDirectory),
    getFile: () => void 0 as any,
    moveDirectory: () => void 0 as any,
    moveFile: () => void 0 as any,
    removeDirectory: () => void 0 as any,
    removeFile: () => void 0 as any,
    updateFile: () => void 0 as any,
  }
}
