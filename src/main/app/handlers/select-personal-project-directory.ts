import { dialog } from "electron"

import UserSettingsStore from "@main/app/user-settings-store"

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
