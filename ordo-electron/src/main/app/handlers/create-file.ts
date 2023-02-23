import { promises } from "fs"
import { join } from "path"

import { ORDO_FILE_EXTENSION, ORDO_METADATA_EXTENSION } from "@core/app/constants"
import { handleListDirectory } from "@main/app/handlers/list-directory"
import localSettingsStore from "@main/app/local-settings-store"
import userSettingsStore from "@main/app/user-settings-store"
import { parseMetadata, parseOrdoFile } from "@core/app/parsers/parse-ordo-file"

export const handleCreateFile = async ({
  path,
  content = "",
}: {
  path: string
  content?: string
}) => {
  const separator = localSettingsStore.get("app.separator")
  const rootPath = userSettingsStore.get("project.personal.directory")

  const windowsSeparator = "\\"

  const isWindowsSeparator = separator === windowsSeparator

  let absolutePath = path.startsWith(rootPath) ? path : join(rootPath, path)

  if (isWindowsSeparator && ~absolutePath.indexOf("/")) {
    absolutePath = absolutePath.replaceAll("/", windowsSeparator)
  }

  if (~absolutePath.indexOf(windowsSeparator)) {
    const parent = absolutePath.slice(0, absolutePath.lastIndexOf(windowsSeparator))

    await promises.mkdir(parent, { recursive: true })
  }

  if (absolutePath.endsWith(windowsSeparator)) {
    return handleListDirectory(rootPath)
  }

  const lastDot = absolutePath.lastIndexOf(".")
  const extension = absolutePath.slice(~lastDot ? lastDot : 0)
  const hasValidExtension = Boolean(extension) && !~extension.indexOf(separator)

  const filePath = hasValidExtension ? absolutePath : absolutePath + ORDO_FILE_EXTENSION
  const writeFile = () => promises.writeFile(filePath, content, "utf8")

  if (filePath.endsWith(ORDO_FILE_EXTENSION)) {
    const metadataPath = filePath + ORDO_METADATA_EXTENSION

    const tree = parseOrdoFile(content)
    const { checkboxes, links, dates, tags } = parseMetadata(tree).data

    await Promise.all([
      promises.writeFile(metadataPath, JSON.stringify({ checkboxes, links, dates, tags }), "utf8"),
      writeFile(),
    ])
  } else {
    await writeFile()
  }

  return handleListDirectory(rootPath)
}
