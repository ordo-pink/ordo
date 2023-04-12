import { OrdoDirectory, OrdoFile } from "@ordo-pink/fs-entity"
import { FileIcon, useModal } from "@ordo-pink/react-utils"
import { hideCommandPalette, showCommandPalette } from "@ordo-pink/stream-command-palette"
import { drive$, fsDriver$ } from "@ordo-pink/stream-drives"
import { createExtension } from "@ordo-pink/stream-extensions"
import { lazy } from "react"
import { AiFillFolder, AiOutlineFolder } from "react-icons/ai"
import {
  BsDownload,
  BsFileEarmarkMinus,
  BsFileEarmarkPlus,
  BsFolderMinus,
  BsFolderPlus,
  BsPencil,
  BsUpload,
} from "react-icons/bs"
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
import RenameDirectoryModal from "./components/rename-directory-modal"
import RenameFileModal from "./components/rename-file-modal"
import UploadFilesModal from "./components/upload-files-modal"

import "./fs.css"

export default createExtension(
  "fs",
  ({
    commands,
    translate,
    registerActivity,
    registerTranslations,
    registerContextMenuItem,
    registerCommandPaletteItem,
  }) => {
    registerTranslations({
      ru: {
        "confirm-remove": 'Вы уверены, что хотите удалить "{{name}}"?',
        root: "Диски",
        devices: "Устройства",
        "shared-directories": "Общий доступ",
        trash: "Трэш",
        "show-create-file-modal": "Создать файл",
        "show-remove-file-modal": "Удалить",
        "show-create-directory-modal": "Создать папку",
        "show-remove-directory-modal": "Удалить",
        "show-rename-file-modal": "Переименовать",
        "show-rename-directory-modal": "Переименовать",
        "show-upload-file-modal": "Загрузить файл",
        "create-file": "Создать файл",
        "rename-file": "Переименовать файл",
        "rename-directory": "Переименовать папку",
        "remove-file": "Удалить файл",
        "remove-file...": "Удалить файл...",
        "download-file": "Скачать файл",
        "download-file...": "Скачать файл...",
        "create-directory": "Создать папку",
        "remove-directory": "Удалить папку...",
        "choose-name-placeholder": "Выбери название...",
        "create-button": "Создать",
        "rename-button": "Переименовать",
        "remove-button": "Удалить",
        "cancel-button": "Не, ну его",
        "upload-file": "Загрузить файл",
        "invalid-name": "Выбранное название содержит запрещённые символы.",
      },
      en: {
        "confirm-remove": 'Are you sure you want to remove "{{name}}"?',
        root: "Disks",
        devices: "Devices",
        "shared-directories": "Shared Access",
        trash: "Trash",
        "show-create-file-modal": "Create file",
        "show-remove-file-modal": "Remove",
        "show-create-directory-modal": "Create directory",
        "show-remove-directory-modal": "Remove",
        "show-rename-file-modal": "Rename",
        "show-rename-directory-modal": "Rename",
        "show-upload-file-modal": "Upload file",
        "create-file": "Create file",
        "rename-file": "Rename file",
        "rename-directory": "Rename directory",
        "remove-file": "Remove file",
        "remove-file...": "Remove file...",
        "download-file": "Download file",
        "download-file...": "Download file...",
        "create-directory": "Create directory",
        "remove-directory": "Remove directory...",
        "choose-name-placeholder": "Choose name...",
        "create-button": "Create",
        "rename-button": "Rename",
        "remove-button": "Remove",
        "cancel-button": "Cancel",
        "upload-file": "Upload",
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

    const downloadFileCommand = commands.on("download-file", ({ payload }) => {
      const driver = fsDriver$.getValue()

      if (!driver) return

      driver.files
        .getContent(payload.path)
        .then((res) => res.blob())
        .then((blob) => URL.createObjectURL(blob))
        .then((url) => {
          const a = document.createElement("a")

          a.href = url
          a.download = `${payload.readableName}${payload.extension}`
          document.body.appendChild(a)

          a.click()

          setTimeout(() => {
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
          }, 0)
        })
    })

    registerContextMenuItem(downloadFileCommand, {
      Icon: BsDownload,
      payloadCreator: (target) => target,
      shouldShow: (target) => OrdoFile.isOrdoFile(target),
    })

    registerCommandPaletteItem({
      id: "download-file",
      name: translate("download-file..."),
      Icon: BsDownload,
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
            onSelect: () => {
              commands.emit("fs.download-file", file)
              hideCommandPalette()
            },
            Comment: () => (
              <div className="text-xs text-neutral-600 dark:text-neutral-400">
                {OrdoFile.getParentPath(file.path)}
              </div>
            ),
          })),
        )
      },
    })

    const uploadFilesCommand = commands.on("show-upload-file-modal", ({ payload }) => {
      const { showModal } = useModal()
      showModal(() => <UploadFilesModal parent={payload} />)
    })

    registerCommandPaletteItem({
      id: "upload-file",
      name: translate("upload-file"),
      Icon: BsUpload,
      onSelect: () => {
        const drive = drive$.getValue()

        if (!drive) return

        commands.emit("fs.show-upload-file-modal", { parent: drive.root, openInEditor: true })
      },
    })

    registerContextMenuItem(uploadFilesCommand, {
      Icon: BsUpload,
      payloadCreator: (target) => target,
      shouldShow: (target) => OrdoDirectory.isOrdoDirectory(target),
    })

    const RENAME_FILE_COMMAND = commands.on("show-rename-file-modal", ({ payload }) => {
      const { showModal } = useModal()

      showModal(() => <RenameFileModal file={payload.file} />)
    })

    registerContextMenuItem(RENAME_FILE_COMMAND, {
      Icon: BsPencil,
      payloadCreator: (target) => ({ file: target }),
      shouldShow: (target) => OrdoFile.isOrdoFile(target),
    })

    const RENAME_DIRECTORY_COMMAND = commands.on("show-rename-directory-modal", ({ payload }) => {
      const { showModal } = useModal()

      showModal(() => <RenameDirectoryModal directory={payload.directory} />)
    })

    registerContextMenuItem(RENAME_DIRECTORY_COMMAND, {
      Icon: BsPencil,
      payloadCreator: (directory) => ({ directory }),
      shouldShow: (target) => OrdoDirectory.isOrdoDirectory(target) && target.path !== "/",
    })

    const CREATE_FILE_COMMAND = commands.on("show-create-file-modal", ({ payload }) => {
      const { showModal } = useModal()

      showModal(() => (
        <CreateFileModal
          parent={payload.parent}
          content={payload.content}
          openInEditor={payload.openFileInEditor}
        />
      ))
    })

    registerContextMenuItem(CREATE_FILE_COMMAND, {
      Icon: BsFileEarmarkPlus,
      payloadCreator: (target) => ({
        parent: target,
      }),
      shouldShow: (target) => OrdoDirectory.isOrdoDirectory(target),
    })

    registerCommandPaletteItem({
      id: "create-file",
      name: translate("create-file"),
      Icon: BsFileEarmarkPlus,
      onSelect: () => {
        const drive = drive$.getValue()

        if (!drive) return

        commands.emit("fs.show-create-file-modal", { parent: drive.root, openInEditor: true })
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
            onSelect: () => {
              commands.emit("fs.show-remove-file-modal", file)
              hideCommandPalette()
            },
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

    registerActivity("fs.file-explorer", {
      Component: lazy(() => import("./components/fs-activity")),
      Icon: lazy(() => import("./components/fs-activity-icon")),
      Sidebar: lazy(() => import("./components/fs-activity-sidebar")),
      routes: ["/fs", "/fs/", "/fs/:path*"],
    })
  },
)
