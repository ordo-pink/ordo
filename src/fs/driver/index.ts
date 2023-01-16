import { FSDriver } from "$core/types"

import { createDirectory } from "$fs/driver/methods/create-directory"
import { createFile } from "$fs/driver/methods/create-file"
import { getDirectory } from "$fs/driver/methods/get-directory"
import { getFile } from "$fs/driver/methods/get-file"
import { moveDirectory } from "$fs/driver/methods/move-directory"
import { moveFile } from "$fs/driver/methods/move-file"
import { removeDirectory } from "$fs/driver/methods/remove-directory"
import { removeFile } from "$fs/driver/methods/remove-file"
import { updateFile } from "$fs/driver/methods/update-file"
import { getNormalizedAbsolutePath } from "$fs/driver/utils/get-normalized-absolute-path"

export const createDefaultFSDriver = (rootDirectory: string): FSDriver => {
  const normalizedDirectory = getNormalizedAbsolutePath("/", rootDirectory)

  return {
    createDirectory: createDirectory(normalizedDirectory),
    createFile: createFile(normalizedDirectory),
    getDirectory: getDirectory(normalizedDirectory),
    getFile: getFile(normalizedDirectory),
    moveDirectory: moveDirectory(normalizedDirectory),
    moveFile: moveFile(normalizedDirectory),
    removeDirectory: removeDirectory(normalizedDirectory),
    removeFile: removeFile(normalizedDirectory),
    updateFile: updateFile(normalizedDirectory),
  }
}
