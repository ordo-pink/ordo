import { dialog } from "electron"
import { promises } from "fs"

import UserSettingsStore from "@main/app/user-settings-store"
import { getDefaultProjectDirectoryPath } from "./get-default-project-directory-path"

export const handleSelectPersonalProjectDirectory = () => {
  const currentProjectDirectory = UserSettingsStore.get("project.personal.directory")

  const userInput = dialog.showOpenDialogSync({
    properties: ["openDirectory", "createDirectory", "promptToCreate", "dontAddToRecent"],
  })

  if (!userInput) return currentProjectDirectory

  const result = userInput[0]

  UserSettingsStore.set("project.personal.directory", result)

  return result
}

export const handleSelectDefaultPersonalProjectDirectory = async () => {
  const path = getDefaultProjectDirectoryPath()

  await promises.mkdir(path, { recursive: true })

  UserSettingsStore.set("project.personal.directory", path)

  return path
}
