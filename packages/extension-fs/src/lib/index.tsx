import { OrdoDirectory, OrdoFile } from "@ordo-pink/fs-entity"
import { useModal } from "@ordo-pink/react-utils"
import { drive$, fsDriver$ } from "@ordo-pink/stream-drives"
import { createExtension } from "@ordo-pink/stream-extensions"
import { BsFileEarmarkMinus, BsFileEarmarkPlus, BsFolderMinus, BsFolderPlus } from "react-icons/bs"
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
import RemoveDirectoryModal from "./components/remove-directory-modal"
import RemoveFileModal from "./components/remove-file-modal"

export default createExtension(
  "fs",
  ({ commands, registerContextMenuItem, registerTranslations }) => {
    registerTranslations({
      ru: {
        "confirm-remove": 'Вы уверены, что хотите удалить "{{name}}"?',
        "show-create-file-modal": "Создать файл",
        "show-remove-file-modal": "Удалить",
        "show-create-directory-modal": "Создать папку",
        "show-remove-directory-modal": "Удалить",
        "create-file": "Создать файл",
        "remove-file": "Удалить файл",
        "create-directory": "Создать папку",
        "choose-name-placeholder": "Выбери название...",
        "create-button": "Создать",
        "remove-button": "Удалить",
        "cancel-button": "Не, ну его",
      },
      en: {
        "confirm-remove": 'Are you sure you want to remove "{{name}}"?',
        "show-create-file-modal": "Create file",
        "show-remove-file-modal": "Remove",
        "show-create-directory-modal": "Create directory",
        "show-remove-directory-modal": "Remove",
        "create-file": "Create file",
        "remove-file": "Remove file",
        "create-directory": "Create directory",
        "choose-name-placeholder": "Choose name...",
        "create-button": "Create",
        "remove-button": "Remove",
        "cancel-button": "Cancel",
      },
    })

    commands.before("auth.logout", () => {
      drive$.next(null)
      fsDriver$.next(null)
    })

    commands.on("move-directory", moveDirectory)
    commands.on("create-directory", createDirectory)
    commands.on("update-directory", updateDirectory)
    commands.on("remove-directory", removeDirectory)

    commands.on("move-file", moveFile)
    commands.on("create-file", createFile)
    commands.on("update-file", updateFile)
    commands.on("remove-file", removeFile)

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

    const REMOVE_FILE_COMMAND = commands.on("show-remove-file-modal", ({ payload }) => {
      const { showModal } = useModal()

      showModal(() => <RemoveFileModal file={payload} />)
    })

    registerContextMenuItem(REMOVE_FILE_COMMAND, {
      Icon: BsFileEarmarkMinus,
      payloadCreator: (target) => target,
      shouldShow: (target) => OrdoFile.isOrdoFile(target),
      accelerator: "ctrl+alt+backspace",
    })

    const REMOVE_DIRECTORY_COMMAND = commands.on("show-remove-directory-modal", ({ payload }) => {
      const { showModal } = useModal()

      showModal(() => <RemoveDirectoryModal directory={payload} />)
    })

    registerContextMenuItem(REMOVE_DIRECTORY_COMMAND, {
      Icon: BsFolderMinus,
      payloadCreator: (target) => target,
      shouldShow: (target) => OrdoDirectory.isOrdoDirectory(target) && target.path !== "/",
      accelerator: "ctrl+alt+backspace",
    })
  },
)
