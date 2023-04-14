import { OrdoDirectory, OrdoFile } from "@ordo-pink/fs-entity"
import { drive$, fsDriver$ } from "@ordo-pink/stream-drives"
import { createExtension } from "@ordo-pink/stream-extensions"
import { lazy } from "react"
import {
  BsArrowCounterclockwise,
  BsDownload,
  BsFileEarmarkMinus,
  BsFileEarmarkPlus,
  BsFiles,
  BsFolderMinus,
  BsFolderPlus,
  BsPalette2,
  BsPencil,
  BsStar,
  BsStarFill,
  BsTrash2Fill,
  BsTrash3,
  BsUpload,
} from "react-icons/bs"
import { handleDownloadCommandPalette } from "./command-palette/download-file"
import { handleRemoveDirectoryCommandPalette } from "./command-palette/remove-directory"
import { handleRemoveFileCommandPalette } from "./command-palette/remove-file"
import {
  handleSetFavouriteCommandPalette,
  handleUnsetFavouriteCommandPalette,
} from "./command-palette/set-favourite"
import { handleShowCreateDirectoryModalCommandPalette } from "./command-palette/show-create-directory-modal"
import { handleShowCreateFileModalCommandPalette } from "./command-palette/show-create-file-modal"
import { handleUploadFileCommandPalette } from "./command-palette/upload-file"
import { archiveDirectory } from "./commands/directory/archive-directory"
import { clearTrashBin } from "./commands/directory/clear-trash-bin"
import { createDirectory } from "./commands/directory/create-directory"
import { moveDirectory } from "./commands/directory/move-directory"
import { removeDirectory } from "./commands/directory/remove-directory"
import { restoreTrashBin } from "./commands/directory/restore-trash-bin"
import { setDirectoryColor } from "./commands/directory/set-directory-color"
import { setFavourite } from "./commands/directory/set-favourite"
import { showClearTrashBinModal } from "./commands/directory/show-clear-trash-bin-modal"
import { showCreateDirectoryModal } from "./commands/directory/show-create-directory-modal"
import { showRemoveDirectoryModal } from "./commands/directory/show-remove-directory-modal"
import { showRenameDirectoryModal } from "./commands/directory/show-rename-directory-modal"
import { unarchiveDirectory } from "./commands/directory/unarchive-directory"
import { unsetFavourite } from "./commands/directory/unset-favourite"
import { updateDirectory } from "./commands/directory/update-directory"
import { archiveFile } from "./commands/files/archive-file"
import { createFile } from "./commands/files/create-file"
import { downloadFile } from "./commands/files/download-file"
import { duplicateFile } from "./commands/files/duplicate-file"
import { moveFile } from "./commands/files/move-file"
import { removeFile } from "./commands/files/remove-file"
import { showCreateFileModal } from "./commands/files/show-create-file-modal"
import { showRemoveFileModal } from "./commands/files/show-remove-file-modal"
import { showRenameFileModal } from "./commands/files/show-rename-file-modal"
import { unarchiveFile } from "./commands/files/unarchive-file"
import { updateFile } from "./commands/files/update-file"
import { updateFileContent } from "./commands/files/update-file-content"
import { uploadFile } from "./commands/files/upload-file"

import en from "./translations/en.json"
import ru from "./translations/ru.json"

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
    // Translations -----------------------------------------------------------

    registerTranslations({ ru, en })

    // Activities -------------------------------------------------------------

    registerActivity("fs.file-explorer", {
      Component: lazy(() => import("./components/fs-activity")),
      Icon: lazy(() => import("./components/fs-activity-icon")),
      Sidebar: lazy(() => import("./components/fs-activity-sidebar")),
      routes: ["/fs", "/fs/", "/fs/:path*"],
    })

    // Commands ---------------------------------------------------------------

    // Commands for internal use ----------------------------------------------

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
    commands.on("update-file-content", updateFileContent)

    // Colors -----------------------------------------------------------------

    // Set directory color ----------------------------------------------------

    const CHANGE_DIRECTORY_COLOR_COMMAND = commands.on("change-directory-color", setDirectoryColor)

    registerContextMenuItem(CHANGE_DIRECTORY_COLOR_COMMAND, {
      type: "update",
      Icon: BsPalette2,
      payloadCreator: (target) => target,
      shouldShow: (target) =>
        OrdoDirectory.isOrdoDirectory(target) && target.path !== "/" && target.path !== "/.trash/",
    })

    // TODO: Set file color
    // TODO: Reset directory color & reset file color

    // Duplicate file ---------------------------------------------------------

    const DUPLICATE_FILE_COMMAND = commands.on("duplicate-file", duplicateFile)

    registerContextMenuItem(DUPLICATE_FILE_COMMAND, {
      type: "create",
      Icon: BsFiles,
      payloadCreator: (target) => target,
      shouldShow: (target) => OrdoFile.isOrdoFile(target) && !target.path.startsWith("/.trash/"),
    })

    // Favourites -------------------------------------------------------------

    // Set favourite ----------------------------------------------------------

    const SET_FAVIOURITE_COMMAND = commands.on("set-favourite", setFavourite)

    registerContextMenuItem(SET_FAVIOURITE_COMMAND, {
      type: "update",
      Icon: BsStarFill,
      payloadCreator: (target) => target,
      shouldShow: (target) =>
        OrdoDirectory.isOrdoDirectory(target) &&
        !target.metadata.isFavourite &&
        !target.path.startsWith("/.trash/") &&
        target.path !== "/",
    })

    registerCommandPaletteItem({
      id: "set-favourite",
      name: translate("set-favourite..."),
      Icon: BsStarFill,
      onSelect: handleSetFavouriteCommandPalette,
    })

    // Unset favourite --------------------------------------------------------

    const UNSET_FAVOURITE_COMMAND = commands.on("unset-favourite", unsetFavourite)

    registerContextMenuItem(UNSET_FAVOURITE_COMMAND, {
      type: "update",
      Icon: BsStar,
      payloadCreator: (target) => target,
      shouldShow: (target) =>
        OrdoDirectory.isOrdoDirectory(target) &&
        !!target.metadata.isFavourite &&
        !target.path.startsWith("/.trash/") &&
        target.path !== "/",
    })

    registerCommandPaletteItem({
      id: "unset-favourite",
      name: translate("unset-favourite..."),
      Icon: BsStar,
      onSelect: handleUnsetFavouriteCommandPalette,
    })

    // Trash bin --------------------------------------------------------------

    // Clear ------------------------------------------------------------------

    commands.after("fs.remove-directory.complete", restoreTrashBin)
    commands.on("clear-trash-bin", clearTrashBin)

    const CLEAR_TRASH_BIN = commands.on("show-clear-trash-bin-modal", showClearTrashBinModal)
    registerContextMenuItem(CLEAR_TRASH_BIN, {
      type: "delete",
      Icon: BsTrash2Fill,
      payloadCreator: () => void 0,
      shouldShow: (target) => OrdoDirectory.isOrdoDirectory(target) && target.path === "/.trash/",
      disabled: (target) => target.children.length === 0,
    })

    // Put to trash -----------------------------------------------------------

    const MOVE_FILE_TO_TRASH = commands.on("move-file-to-trash", archiveFile)
    registerContextMenuItem(MOVE_FILE_TO_TRASH, {
      type: "delete",
      Icon: BsTrash3,
      payloadCreator: (target) => target,
      shouldShow: (target) => OrdoFile.isOrdoFile(target) && !target.path.startsWith("/.trash/"),
    })

    const MOVE_DIRECTORY_TO_TRASH = commands.on("move-directory-to-trash", archiveDirectory)
    registerContextMenuItem(MOVE_DIRECTORY_TO_TRASH, {
      type: "delete",
      Icon: BsTrash3,
      payloadCreator: (target) => target,
      shouldShow: (target) =>
        OrdoDirectory.isOrdoDirectory(target) &&
        !target.path.startsWith("/.trash/") &&
        target.path !== "/.trash/" &&
        target.path !== "/",
    })

    // TODO: CommandPalette
    // TODO: Restore to where the file was moved to trash from (not to "/")

    // Restore from trash -----------------------------------------------------

    const UNARCHIVE_FILE_COMMAND = commands.on("restore-file-from-trash", unarchiveFile)
    registerContextMenuItem(UNARCHIVE_FILE_COMMAND, {
      type: "delete",
      Icon: BsArrowCounterclockwise,
      payloadCreator: (target) => target,
      shouldShow: (target) => OrdoFile.isOrdoFile(target) && target.path.startsWith("/.trash/"),
    })

    const UNARCHIVE_DIRECTORY_COMMAND = commands.on(
      "restore-directory-from-trash",
      unarchiveDirectory,
    )
    registerContextMenuItem(UNARCHIVE_DIRECTORY_COMMAND, {
      type: "delete",
      Icon: BsArrowCounterclockwise,
      payloadCreator: (target) => target,
      shouldShow: (target) =>
        OrdoDirectory.isOrdoDirectory(target) &&
        target.path.startsWith("/.trash/") &&
        target.path !== "/.trash/" &&
        target.path !== "/",
    })

    // TODO: CommandPalette

    // Download file ----------------------------------------------------------

    const DOWNLOAD_FILE_COMMAND = commands.on("download-file", downloadFile)
    registerContextMenuItem(DOWNLOAD_FILE_COMMAND, {
      type: "read",
      Icon: BsDownload,
      payloadCreator: (target) => target,
      shouldShow: (target) => OrdoFile.isOrdoFile(target),
    })

    registerCommandPaletteItem({
      id: "download-file",
      name: translate("download-file..."),
      Icon: BsDownload,
      onSelect: handleDownloadCommandPalette,
    })

    // TODO: Download directory

    // Upload file ------------------------------------------------------------

    const UPLOAD_FILE_COMMAND = commands.on("show-upload-file-modal", uploadFile)
    registerContextMenuItem(UPLOAD_FILE_COMMAND, {
      type: "create",
      Icon: BsUpload,
      payloadCreator: (target) => target,
      shouldShow: (target) => OrdoDirectory.isOrdoDirectory(target) && target.path !== "/.trash/",
    })

    registerCommandPaletteItem({
      id: "upload-file",
      name: translate("upload-file"),
      Icon: BsUpload,
      onSelect: handleUploadFileCommandPalette,
    })

    // TODO: Upload multiple files

    // Rename -----------------------------------------------------------------

    const RENAME_FILE_COMMAND = commands.on("show-rename-file-modal", showRenameFileModal)
    registerContextMenuItem(RENAME_FILE_COMMAND, {
      type: "update",
      Icon: BsPencil,
      payloadCreator: (target) => target,
      shouldShow: (target) => OrdoFile.isOrdoFile(target),
    })

    const RENAME_DIRECTORY_COMMAND = commands.on(
      "show-rename-directory-modal",
      showRenameDirectoryModal,
    )
    registerContextMenuItem(RENAME_DIRECTORY_COMMAND, {
      type: "update",
      Icon: BsPencil,
      payloadCreator: (target) => target,
      shouldShow: (target) =>
        OrdoDirectory.isOrdoDirectory(target) && target.path !== "/" && target.path !== "/.trash/",
    })

    // Create -----------------------------------------------------------------

    // Create file ------------------------------------------------------------

    const CREATE_FILE_COMMAND = commands.on("show-create-file-modal", showCreateFileModal)

    registerContextMenuItem(CREATE_FILE_COMMAND, {
      type: "create",
      Icon: BsFileEarmarkPlus,
      payloadCreator: (parent) => ({ parent }),
      shouldShow: (target) => OrdoDirectory.isOrdoDirectory(target) && target.path !== "/.trash/",
    })

    registerCommandPaletteItem({
      id: "create-file",
      name: translate("create-file"),
      Icon: BsFileEarmarkPlus,
      onSelect: handleShowCreateFileModalCommandPalette,
    })

    // TODO: Create a virtual file if it doesn't have content

    // Create directory -------------------------------------------------------

    const CREATE_DIRECTORY_COMMAND = commands.on(
      "show-create-directory-modal",
      showCreateDirectoryModal,
    )

    registerContextMenuItem(CREATE_DIRECTORY_COMMAND, {
      type: "create",
      Icon: BsFolderPlus,
      payloadCreator: (target) => target,
      shouldShow: (target) => OrdoDirectory.isOrdoDirectory(target) && target.path !== "/.trash/",
    })

    registerCommandPaletteItem({
      id: "create-directory",
      name: translate("create-directory"),
      Icon: BsFolderPlus,
      onSelect: handleShowCreateDirectoryModalCommandPalette,
    })

    // Remove -----------------------------------------------------------------

    // Remove file ------------------------------------------------------------

    const REMOVE_FILE_COMMAND = commands.on("show-remove-file-modal", showRemoveFileModal)

    registerContextMenuItem(REMOVE_FILE_COMMAND, {
      type: "delete",
      Icon: BsFileEarmarkMinus,
      payloadCreator: (target) => target,
      shouldShow: (target) => OrdoFile.isOrdoFile(target),
    })

    registerCommandPaletteItem({
      id: "remove-file",
      name: translate("remove-file..."),
      Icon: BsFileEarmarkMinus,
      onSelect: handleRemoveFileCommandPalette,
    })

    // Remove directory -------------------------------------------------------

    const REMOVE_DIRECTORY_COMMAND = commands.on(
      "show-remove-directory-modal",
      showRemoveDirectoryModal,
    )

    registerContextMenuItem(REMOVE_DIRECTORY_COMMAND, {
      type: "delete",
      Icon: BsFolderMinus,
      payloadCreator: (target) => target,
      shouldShow: (target) =>
        OrdoDirectory.isOrdoDirectory(target) && target.path !== "/" && target.path !== "/.trash/",
    })

    registerCommandPaletteItem({
      id: "remove-directory",
      name: translate("remove-directory"),
      Icon: BsFolderMinus,
      onSelect: handleRemoveDirectoryCommandPalette,
    })
  },
)
