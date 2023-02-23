import {
  handleSelectPersonalProjectDirectory,
  handleSelectDefaultPersonalProjectDirectory,
} from "@main/app/handlers/select-personal-project-directory"
import { handleCreateDirectory } from "@main/app/handlers/create-directory"
import { handleSetUserSetting } from "@main/app/handlers/set-user-setting"
import { handleListDirectory } from "@main/app/handlers/list-directory"
import { registerMainHandlers } from "@main/register-main-handlers"
import { handleCreateFile } from "@main/app/handlers/create-file"
import { handleSaveFile } from "@main/app/handlers/save-file"
import { handleOpenFile } from "@main/app/handlers/open-file"
import { handleDelete } from "@main/app/handlers/delete"
import { handleRename } from "@main/app/handlers/rename"
import LocalSettingsStore from "@main/app/local-settings-store"
import UserSettingsStore from "@main/app/user-settings-store"
import { getDefaultProjectDirectoryPath } from "./handlers/get-default-project-directory-path"

export default registerMainHandlers({
  "@app/rename": handleRename,
  "@app/delete": handleDelete,
  "@app/saveFile": handleSaveFile,
  "@app/openFile": handleOpenFile,
  "@app/createFile": handleCreateFile,
  "@app/listDirectory": handleListDirectory,
  "@app/setUserSetting": handleSetUserSetting,
  "@app/setLocalSetting": handleSetUserSetting,
  "@app/createDirectory": handleCreateDirectory,
  "@app/getUserSettings": () => UserSettingsStore.store,
  "@app/getLocalSettings": () => LocalSettingsStore.store,
  "@app/getDefaultProjectDirectory": getDefaultProjectDirectoryPath,
  "@app/selectPersonalProjectDirectory": handleSelectPersonalProjectDirectory,
  "@app/selectDefaultPersonalProjectDirectory": handleSelectDefaultPersonalProjectDirectory,
})
