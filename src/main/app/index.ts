import LocalSettingsStore from "@main/app/local-settings-store"
import UserSettingsStore from "@main/app/user-settings-store"
import { handleSelectPersonalProjectDirectory } from "@main/app/handlers/select-personal-project-directory"
import { handleSetUserSetting } from "@main/app/handlers/set-user-setting"
import { handleCreateFolder } from "@main/app/handlers/create-folder"
import { registerMainHandlers } from "@main/register-main-handlers"
import { handleListFolder } from "@main/app/handlers/list-folder"
import { handleCreateFile } from "@main/app/handlers/create-file"
import { handleOpenFile } from "@main/app/handlers/open-file"
import { handleDelete } from "@main/app/handlers/delete"
import { handleRename } from "@main/app/handlers/rename"
import { handleSaveFile } from "@main/app/handlers/save-file"

export default registerMainHandlers({
  "@app/rename": handleRename,
  "@app/delete": handleDelete,
  "@app/saveFile": handleSaveFile,
  "@app/openFile": handleOpenFile,
  "@app/listFolder": handleListFolder,
  "@app/createFile": handleCreateFile,
  "@app/createFolder": handleCreateFolder,
  "@app/setUserSetting": handleSetUserSetting,
  "@app/setLocalSetting": handleSetUserSetting,
  "@app/getUserSettings": () => UserSettingsStore.store,
  "@app/getLocalSettings": () => LocalSettingsStore.store,
  "@app/selectPersonalProjectDirectory": handleSelectPersonalProjectDirectory,
})
