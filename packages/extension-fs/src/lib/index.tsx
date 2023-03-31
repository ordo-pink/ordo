import { OrdoDirectory, OrdoFile } from "@ordo-pink/fs-entity"
import { FileIcon, useModal } from "@ordo-pink/react-utils"
import { hideCommandPalette, showCommandPalette } from "@ordo-pink/stream-command-palette"
import { drive$, fsDriver$ } from "@ordo-pink/stream-drives"
import { createExtension } from "@ordo-pink/stream-extensions"
import { AiFillFolder, AiOutlineFolder } from "react-icons/ai"
import { BsFileEarmarkMinus, BsFileEarmarkPlus, BsFolderMinus, BsFolderPlus, BsUpload } from "react-icons/bs"
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
import UploadFilesModal from './components/upload-files-modal';

export default createExtension(
  "fs",
  ({
    commands,
    registerContextMenuItem,
    registerTranslations,
    registerCommandPaletteItem,
    translate,
  }) => {
    registerTranslations({
      ru: {
        "confirm-remove": 'Вы уверены, что хотите удалить "{{name}}"?',
        "show-create-file-modal": "Создать файл",
        "show-remove-file-modal": "Удалить",
        "show-create-directory-modal": "Создать папку",
        "show-remove-directory-modal": "Удалить",
        "create-file": "Создать файл",
        "remove-file": "Удалить файл",
        "remove-file...": "Удалить файл...",
        "create-directory": "Создать папку",
        "remove-directory": "Удалить папку...",
        "choose-name-placeholder": "Выбери название...",
        "create-button": "Создать",
        "remove-button": "Удалить",
        "cancel-button": "Не, ну его",
        "upload-files": "Загрузить",
        "invalid-name": "Выбранное название содержит запрещённые символы.",
      },
      en: {
        "confirm-remove": 'Are you sure you want to remove "{{name}}"?',
        "show-create-file-modal": "Create file",
        "show-remove-file-modal": "Remove",
        "show-create-directory-modal": "Create directory",
        "show-remove-directory-modal": "Remove",
        "create-file": "Create file",
        "remove-file": "Remove file",
        "remove-file...": "Remove file...",
        "create-directory": "Create directory",
        "remove-directory": "Remove directory...",
        "choose-name-placeholder": "Choose name...",
        "create-button": "Create",
        "remove-button": "Remove",
        "cancel-button": "Cancel",
        "upload-files": "Upload",
        "invalid-name": "Provided name contains forbidden characters.",
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

    const uploadFilesCommand = commands.on('upload-files', ({ payload }) => {
      const { showModal } = useModal()
      showModal(() => <UploadFilesModal parent={payload} />)
    })

    registerContextMenuItem(uploadFilesCommand, {
      Icon: BsUpload,
      payloadCreator: (target) => target,
      shouldShow: (target) => OrdoDirectory.isOrdoDirectory(target),
    })

    const CREATE_FILE_COMMAND = commands.on("show-create-file-modal", ({ payload }) => {
      const { showModal } = useModal()

      showModal(() => <CreateFileModal parent={payload} />)
    })

    registerContextMenuItem(CREATE_FILE_COMMAND, {
      Icon: BsFileEarmarkPlus,
      payloadCreator: (target) => target,
      shouldShow: (target) => OrdoDirectory.isOrdoDirectory(target),
    })

    registerCommandPaletteItem({
      id: "create-file",
      name: translate("create-file"),
      Icon: BsFileEarmarkPlus,
      onSelect: () => {
        const drive = drive$.getValue()

        if (!drive) return

        commands.emit("fs.show-create-file-modal", drive.root)
      },
    })

    const CREATE_DIRECTORY_COMMAND = commands.on("show-create-directory-modal", ({ payload }) => {
      const { showModal } = useModal()

      showModal(() => <CreateDirectoryModal parent={payload} />)
    })

    registerContextMenuItem(CREATE_DIRECTORY_COMMAND, {
      Icon: BsFolderPlus,
      payloadCreator: (target) => target,
      shouldShow: (target) => OrdoDirectory.isOrdoDirectory(target),
    })

    registerCommandPaletteItem({
      id: "create-directory",
      name: translate("create-directory"),
      Icon: BsFolderPlus,
      onSelect: () => {
        const drive = drive$.getValue()

        if (!drive) return

        commands.emit("fs.show-create-directory-modal", drive.root)
      },
    })

    const REMOVE_FILE_COMMAND = commands.on("show-remove-file-modal", ({ payload }) => {
      const { showModal } = useModal()

      showModal(() => <RemoveFileModal file={payload} />)
    })

    registerContextMenuItem(REMOVE_FILE_COMMAND, {
      Icon: BsFileEarmarkMinus,
      payloadCreator: (target) => target,
      shouldShow: (target) => OrdoFile.isOrdoFile(target),
    })

    registerCommandPaletteItem({
      id: "remove-file",
      name: translate("remove-file..."),
      Icon: BsFileEarmarkMinus,
      onSelect: () => {
        hideCommandPalette()

        const drive = drive$.getValue()

        if (!drive) return

        const files = drive.root.getFilesDeep()

        showCommandPalette(
          files.map((file) => ({
            id: file.path,
            name: file.readableName,
            Icon: () => <FileIcon file={file} />,
            onSelect: () => commands.emit("fs.show-remove-file-modal", file),
            Comment: () => (
              <div className="text-xs text-neutral-600 dark:text-neutral-400">
                {OrdoFile.getParentPath(file.path)}
              </div>
            ),
          })),
        )
      },
    })

    const REMOVE_DIRECTORY_COMMAND = commands.on("show-remove-directory-modal", ({ payload }) => {
      const { showModal } = useModal()

      showModal(() => <RemoveDirectoryModal directory={payload} />)
    })

    registerContextMenuItem(REMOVE_DIRECTORY_COMMAND, {
      Icon: BsFolderMinus,
      payloadCreator: (target) => target,
      shouldShow: (target) => OrdoDirectory.isOrdoDirectory(target) && target.path !== "/",
    })

    registerCommandPaletteItem({
      id: "remove-directory",
      name: translate("remove-directory"),
      Icon: BsFolderMinus,
      onSelect: () => {
        hideCommandPalette()

        const drive = drive$.getValue()

        if (!drive) return

        const directories = drive.root.getDirectoriesDeep()

        showCommandPalette(
          directories.map((directory) => ({
            id: directory.path,
            name: directory.readableName,
            Icon: () => (directory.children.length > 0 ? <AiFillFolder /> : <AiOutlineFolder />),
            onSelect: () => commands.emit("fs.show-remove-directory-modal", directory),
            Comment: () => (
              <div className="text-xs text-neutral-600 dark:text-neutral-400">{directory.path}</div>
            ),
          })),
        )
      },
    })
  },
)
