import { FSDriver } from "$core/types"

import { createDirectory } from "$fs/driver/methods/create-directory"
import { createFile } from "$fs/driver/methods/create-file"
import { getDirectory } from "$fs/driver/methods/get-directory"
import { getFile } from "$fs/driver/methods/get-file"
import { moveDirectory } from "$fs/driver/methods/move-directory"
import { moveFile } from "$fs/driver/methods/move-file"

export const createDefaultFSDriver = (rootDirectory: string): FSDriver => {
  const normalizedDirectory = rootDirectory.replaceAll("\\", "/")

  return {
    createDirectory: createDirectory(normalizedDirectory),
    createFile: createFile(normalizedDirectory),
    getDirectory: getDirectory(normalizedDirectory),
    getFile: getFile(normalizedDirectory),
    moveDirectory: moveDirectory(normalizedDirectory),
    moveFile: moveFile(normalizedDirectory),
    removeDirectory: () => void 0 as any,
    removeFile: () => void 0 as any,
    updateFile: () => void 0 as any,
  }
}
