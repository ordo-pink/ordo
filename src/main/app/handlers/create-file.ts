import { ORDO_FILE_EXTENSION, ORDO_METADATA_EXTENSION } from "@core/app/constants"

import { promises } from "fs"
import localSettingsStore from "../local-settings-store"
import { handleListFolder } from "./list-folder"
import userSettingsStore from "../user-settings-store"

export const handleCreateFile = async (path: string) => {
  const separator = localSettingsStore.get("app.separator")
  const rootPath = userSettingsStore.get("project.personal.directory")

  const windowsSeparator = "\\"

  const isWindowsSeparator = separator === windowsSeparator

  if (isWindowsSeparator && ~path.indexOf("/")) {
    path = path.replaceAll("/", windowsSeparator)
  }

  if (~path.indexOf(windowsSeparator)) {
    const parent = path.slice(0, path.lastIndexOf(windowsSeparator))

    await promises.mkdir(parent, { recursive: true })
  }

  if (path.endsWith(windowsSeparator)) {
    return handleListFolder(rootPath)
  }

  const lastDot = path.lastIndexOf(".")
  const extension = path.slice(~lastDot ? lastDot : 0)
  const hasValidExtension = Boolean(extension) && !~extension.indexOf(separator)

  const filePath = hasValidExtension ? path : path + ORDO_FILE_EXTENSION
  const writeFile = () => promises.writeFile(filePath, "\n", "utf8")

  // TODO: 90

  // TODO: 91
  if (filePath.endsWith(ORDO_FILE_EXTENSION)) {
    const metadataPath = filePath + ORDO_METADATA_EXTENSION

    await Promise.all([promises.writeFile(metadataPath, "{}", "utf8"), writeFile()])
  } else {
    await writeFile()
  }

  return handleListFolder(rootPath)
}
