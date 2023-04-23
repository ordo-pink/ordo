import { OrdoDirectory, OrdoFile } from "@ordo-pink/fs-entity"
import { wieldCurrentActivity } from "@ordo-pink/react-utils"
import { drive$, fsDriver$ } from "@ordo-pink/stream-drives"
import { createExtension } from "@ordo-pink/stream-extensions"
import { lazy } from "react"
import {
  BsArrowCounterclockwise,
  BsDownload,
  BsFileEarmarkMinus,
  BsFileEarmarkPlus,
  BsFiles,
  BsFolder2Open,
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
  handleSetFavouriteDirectoryCommandPalette,
  handleUnsetFavouriteDirectoryCommandPalette,
} from "./command-palette/set-favourite-directory"
import { handleShowCreateDirectoryModalCommandPalette } from "./command-palette/show-create-directory-modal"
import { handleShowCreateFileModalCommandPalette } from "./command-palette/show-create-file-modal"
import { handleUploadFileCommandPalette } from "./command-palette/upload-file"
import { archiveDirectory } from "./commands/directory/archive-directory"
import { clearTrashBin } from "./commands/directory/clear-trash-bin"
import { createDirectory } from "./commands/directory/create-directory"
import { moveDirectory } from "./commands/directory/move-directory"
import { openDirectoryInFs } from "./commands/directory/open-in-fs"
import { removeDirectory } from "./commands/directory/remove-directory"
import { restoreTrashBin } from "./commands/directory/restore-trash-bin"
import { setDirectoryColor } from "./commands/directory/set-directory-colour"
import { setFavouriteDirectory } from "./commands/directory/set-favourite-directory"
import { showClearTrashBinModal } from "./commands/directory/show-clear-trash-bin-modal"
import { showCreateDirectoryModal } from "./commands/directory/show-create-directory-modal"
import { showRemoveDirectoryModal } from "./commands/directory/show-remove-directory-modal"
import { showRenameDirectoryModal } from "./commands/directory/show-rename-directory-modal"
import { unarchiveDirectory } from "./commands/directory/unarchive-directory"
import { unsetFavouriteDirectory } from "./commands/directory/unset-favourite-directory"
import { updateDirectory } from "./commands/directory/update-directory"
import { archiveFile } from "./commands/files/archive-file"
import { createFile } from "./commands/files/create-file"
import { downloadFile } from "./commands/files/download-file"
import { duplicateFile } from "./commands/files/duplicate-file"
import { moveFile } from "./commands/files/move-file"
import { removeFile } from "./commands/files/remove-file"
import { setFavouriteFile } from "./commands/files/set-favourite-file"
import { setFileColor } from "./commands/files/set-file-colour"
import { showCreateFileModal } from "./commands/files/show-create-file-modal"
import { showRemoveFileModal } from "./commands/files/show-remove-file-modal"
import { showRenameFileModal } from "./commands/files/show-rename-file-modal"
import { unarchiveFile } from "./commands/files/unarchive-file"
import { unsetFavouriteFile } from "./commands/files/unset-favourite-file"
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

    registerActivity("file-explorer", {
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

    // Open in FS -------------------------------------------------------------

    const OPEN_DIRECTORY_IN_FS = commands.on("open-directory-in-fs", openDirectoryInFs)

    registerContextMenuItem(OPEN_DIRECTORY_IN_FS, {
      type: "read",
      Icon: BsFolder2Open,
      payloadCreator: (target) => target,
      shouldShow: (target) => {
        const currentActivity = wieldCurrentActivity()

        return OrdoDirectory.isOrdoDirectory(target) && currentActivity?.name !== "fs.file-explorer"
      },
    })

    // TODO: Reveal file in FS

    // Colors -----------------------------------------------------------------

    // Set directory colour ---------------------------------------------------

    const CHANGE_DIRECTORY_COLOUR_COMMAND = commands.on(
      "change-directory-colour",
      setDirectoryColor,
    )

    registerContextMenuItem(CHANGE_DIRECTORY_COLOUR_COMMAND, {
      type: "update",
      Icon: BsPalette2,
      payloadCreator: (target) => target,
      shouldShow: (target) =>
        OrdoDirectory.isOrdoDirectory(target) && target.path !== "/" && target.path !== "/.trash/",
    })

    // Set file colour --------------------------------------------------------

    const CHANGE_FILE_COLOUR_COMMAND = commands.on("change-file-colour", setFileColor)

    registerContextMenuItem(CHANGE_FILE_COLOUR_COMMAND, {
      type: "update",
      Icon: BsPalette2,
      payloadCreator: (target) => target,
      shouldShow: (target) => OrdoFile.isOrdoFile(target) && target.path !== "/.avatar.png",
    })

    // TODO: Reset directory colour & reset file colour

    // Duplicate file ---------------------------------------------------------

    const DUPLICATE_FILE_COMMAND = commands.on("duplicate-file", duplicateFile)

    registerContextMenuItem(DUPLICATE_FILE_COMMAND, {
      type: "create",
      Icon: BsFiles,
      payloadCreator: (target) => target,
      shouldShow: (target) => OrdoFile.isOrdoFile(target) && !target.path.startsWith("/.trash/"),
    })

    // Favourites -------------------------------------------------------------

    // Set favourite directory ------------------------------------------------

    const SET_FAVIOURITE_DIRECTORY_COMMAND = commands.on(
      "set-favourite-directory",
      setFavouriteDirectory,
    )

    registerContextMenuItem(SET_FAVIOURITE_DIRECTORY_COMMAND, {
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
      id: "set-favourite-directory",
      name: translate("set-favourite-directory..."),
      Icon: BsStarFill,
      onSelect: handleSetFavouriteDirectoryCommandPalette,
    })

    // Unset favourite directory ----------------------------------------------

    const UNSET_FAVOURITE_DIRECTORY_COMMAND = commands.on(
      "unset-favourite-directory",
      unsetFavouriteDirectory,
    )

    registerContextMenuItem(UNSET_FAVOURITE_DIRECTORY_COMMAND, {
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
      id: "unset-favourite-directory",
      name: translate("unset-favourite-directory..."),
      Icon: BsStar,
      onSelect: handleUnsetFavouriteDirectoryCommandPalette,
    })

    // Set favourite file -----------------------------------------------------

    const SET_FAVIOURITE_FILE_COMMAND = commands.on("set-favourite-file", setFavouriteFile)

    registerContextMenuItem(SET_FAVIOURITE_FILE_COMMAND, {
      type: "update",
      Icon: BsStarFill,
      payloadCreator: (target) => target,
      shouldShow: (target) =>
        OrdoFile.isOrdoFile(target) &&
        !target.metadata.isFavourite &&
        target.path !== "/.avatar.png",
    })

    // Unset favourite file ---------------------------------------------------

    const UNSET_FAVOURITE_FILE_COMMAND = commands.on("unset-favourite-file", unsetFavouriteFile)

    registerContextMenuItem(UNSET_FAVOURITE_FILE_COMMAND, {
      type: "update",
      Icon: BsStar,
      payloadCreator: (target) => target,
      shouldShow: (target) =>
        OrdoFile.isOrdoFile(target) &&
        !!target.metadata.isFavourite &&
        target.path !== "/.avatar.png",
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
