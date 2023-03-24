import { OrdoDirectory } from "@ordo-pink/fs-entity"
import { useModal } from "@ordo-pink/react-utils"
import { drive$, fsDriver$ } from "@ordo-pink/stream-drives"
import { createExtension } from "@ordo-pink/stream-extensions"
import { BsFileEarmarkPlus, BsFolderPlus } from "react-icons/bs"
import { createDirectory } from "./commands/directory/create-directory"
import { moveDirectory } from "./commands/directory/move-directory"
import { removeDirectory } from "./commands/directory/remove-directory"
import { updateDirectory } from "./commands/directory/update-directory"
import { createFile } from "./commands/files/create-file"
import { moveFile } from "./commands/files/move-file"
import { removeFile } from "./commands/files/remove-file"
import { updateFile } from "./commands/files/update-file"

import CreateDirectoryModal from "./components/create-directory-modal"
import CreateFileModal from "./components/create-file-modal"

export default createExtension(
  "fs",
  ({ commands, registerContextMenuItem, registerTranslations }) => {
    registerTranslations({
      ru: {
        "show-create-file-modal": "Создать файл",
        "show-create-directory-modal": "Создать папку",
        "create-file": "Создать файл",
        "create-directory": "Создать папку",
        "choose-name-placeholder": "Выбери название...",
        "create-button": "Создать",
        "cancel-button": "Да ну его",
      },
      en: {
        "show-create-file-modal": "Create file",
        "show-create-directory-modal": "Create directory",
        "create-file": "Create file",
        "create-directory": "Create directory",
        "choose-name-placeholder": "Choose name...",
        "create-button": "Create",
        "cancel-button": "Cancel",
      },
    })

    commands.before("auth.logout", () => {
      drive$.next(null)
      fsDriver$.next(null)
    })

    const CREATE_FILE_COMMAND = commands.on("show-create-file-modal", ({ payload }) => {
      const { showModal } = useModal()

      showModal(() => <CreateFileModal parent={payload} />)
    })

    registerContextMenuItem(CREATE_FILE_COMMAND, {
      Icon: BsFileEarmarkPlus,
      payloadCreator: (target) => target,
      shouldShow: (target) => OrdoDirectory.isOrdoDirectory(target),
      accelerator: "alt+n",
    })

    const CREATE_DIRECTORY_COMMAND = commands.on("show-create-directory-modal", ({ payload }) => {
      const { showModal } = useModal()

      showModal(() => <CreateDirectoryModal parent={payload} />)
    })

    registerContextMenuItem(CREATE_DIRECTORY_COMMAND, {
      Icon: BsFolderPlus,
      payloadCreator: (target) => target,
      shouldShow: (target) => OrdoDirectory.isOrdoDirectory(target),
      accelerator: "alt+shift+n",
    })

    commands.on("move-directory", moveDirectory)
    commands.on("create-directory", createDirectory)
    commands.on("update-directory", updateDirectory)
    commands.on("remove-directory", removeDirectory)

    commands.on("move-file", moveFile)
    commands.on("create-file", createFile)
    commands.on("update-file", updateFile)
    commands.on("remove-file", removeFile)
  },
)
