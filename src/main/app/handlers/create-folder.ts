import { promises } from "fs"

import localSettingsStore from "../local-settings-store"
import userSettingsStore from "../user-settings-store"
import { handleListFolder } from "./list-folder"

export const handleCreateFolder = async (path: string) => {
  const separator = localSettingsStore.get("app.separator")
  const rootPath = userSettingsStore.get("project.personal.directory")

  const windowsSeparator = "\\"
  const isWindowsSeparator = separator === windowsSeparator

  if (isWindowsSeparator && ~path.indexOf("/")) {
    path = path.replaceAll("/", windowsSeparator)
  }

  await promises.mkdir(path, { recursive: true })

  return handleListFolder(rootPath)
}
