import { promises } from "fs"

import { handleListDirectory } from "@main/app/handlers/list-directory"
import localSettingsStore from "@main/app/local-settings-store"
import userSettingsStore from "@main/app/user-settings-store"

export const handleCreateDirectory = async (path: string) => {
  // TODO:BUG: Fix creating nested directories that have the same name
  const separator = localSettingsStore.get("app.separator")
  const rootPath = userSettingsStore.get("project.personal.directory")

  const windowsSeparator = "\\"
  const isWindowsSeparator = separator === windowsSeparator

  if (isWindowsSeparator && ~path.indexOf("/")) {
    path = path.replaceAll("/", windowsSeparator)
  }

  await promises.mkdir(path, { recursive: true })

  return handleListDirectory(rootPath)
}
