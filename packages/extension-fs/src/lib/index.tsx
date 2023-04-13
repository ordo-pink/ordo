import { OrdoDirectory, OrdoFile } from "@ordo-pink/fs-entity"
import { drive$, fsDriver$ } from "@ordo-pink/stream-drives"
import { createExtension } from "@ordo-pink/stream-extensions"
import { lazy } from "react"
import {
  BsArrowCounterclockwise,
  BsDownload,
  BsFileEarmarkMinus,
  BsFileEarmarkPlus,
  BsFolderMinus,
  BsFolderPlus,
  BsPalette2,
  BsPencil,
  BsStar,
  BsStarFill,
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
import { createDirectory } from "./commands/directory/create-directory"
import { moveDirectory } from "./commands/directory/move-directory"
import { removeDirectory } from "./commands/directory/remove-directory"
import { renameDirectory } from "./commands/directory/rename-directory"
import { setDirectoryColor } from "./commands/directory/set-directory-color"
import { setFavourite } from "./commands/directory/set-favourite"
import { showCreateDirectoryModal } from "./commands/directory/show-create-directory-modal"
import { showRemoveDirectoryModal } from "./commands/directory/show-remove-directory-modal"
import { unarchiveDirectory } from "./commands/directory/unarchive-directory"
import { unsetFavourite } from "./commands/directory/unset-favourite"
import { updateDirectory } from "./commands/directory/update-directory"
import { archiveFile } from "./commands/files/archive-file"
import { createFile } from "./commands/files/create-file"
import { downloadFile } from "./commands/files/download-file"
import { moveFile } from "./commands/files/move-file"
import { removeFile } from "./commands/files/remove-file"
import { renameFile } from "./commands/files/rename-file"
import { showCreateFileModal } from "./commands/files/show-create-file-modal"
import { showRemoveFileModal } from "./commands/files/show-remove-file-modal"
import { unarchiveFile } from "./commands/files/unarchive-file"
import { updateFile } from "./commands/files/update-file"
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

    // Colors -----------------------------------------------------------------

    // Set directory color ----------------------------------------------------

    const CHANGE_DIRECTORY_COLOR_COMMAND = commands.on("change-directory-color", setDirectoryColor)

    registerContextMenuItem(CHANGE_DIRECTORY_COLOR_COMMAND, {
      Icon: BsPalette2,
      payloadCreator: (target) => target,
      shouldShow: (target) =>
        OrdoDirectory.isOrdoDirectory(target) && target.path !== "/" && target.path !== "/.trash/",
    })

    // TODO: Set file color
    // TODO: Reset directory color & reset file color

    // Favourites -------------------------------------------------------------

    // Set favourite ----------------------------------------------------------

    const SET_FAVIOURITE_COMMAND = commands.on("set-favourite", setFavourite)

    registerContextMenuItem(SET_FAVIOURITE_COMMAND, {
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

    // Archive ----------------------------------------------------------------

    const ARCHIVE_FILE_COMMAND = commands.on("archive-file", archiveFile)
    registerContextMenuItem(ARCHIVE_FILE_COMMAND, {
      Icon: BsTrash3,
      payloadCreator: (target) => target,
      shouldShow: (target) => OrdoFile.isOrdoFile(target) && !target.path.startsWith("/.trash/"),
    })

    const ARCHIVE_DIRECTORY_COMMAND = commands.on("archive-directory", archiveDirectory)
    registerContextMenuItem(ARCHIVE_DIRECTORY_COMMAND, {
      Icon: BsTrash3,
      payloadCreator: (target) => target,
      shouldShow: (target) =>
        OrdoDirectory.isOrdoDirectory(target) &&
        !target.path.startsWith("/.trash/") &&
        target.path !== "/.trash/" &&
        target.path !== "/",
    })

    // TODO: CommandPalette
    // TODO: Clear trash
    // TODO: Restore to where the file was moved to trash from (not to "/")

    // Unarchive --------------------------------------------------------------

    const UNARCHIVE_FILE_COMMAND = commands.on("unarchive-file", unarchiveFile)
    registerContextMenuItem(UNARCHIVE_FILE_COMMAND, {
      Icon: BsArrowCounterclockwise,
      payloadCreator: (target) => target,
      shouldShow: (target) => OrdoFile.isOrdoFile(target) && target.path.startsWith("/.trash/"),
    })

    const UNARCHIVE_DIRECTORY_COMMAND = commands.on("unarchive-directory", unarchiveDirectory)
    registerContextMenuItem(UNARCHIVE_DIRECTORY_COMMAND, {
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

    const RENAME_FILE_COMMAND = commands.on("show-rename-file-modal", renameFile)
    registerContextMenuItem(RENAME_FILE_COMMAND, {
      Icon: BsPencil,
      payloadCreator: (target) => ({ file: target }),
      shouldShow: (target) => OrdoFile.isOrdoFile(target),
    })

    const RENAME_DIRECTORY_COMMAND = commands.on("show-rename-directory-modal", renameDirectory)
    registerContextMenuItem(RENAME_DIRECTORY_COMMAND, {
      Icon: BsPencil,
      payloadCreator: (directory) => ({ directory }),
      shouldShow: (target) =>
        OrdoDirectory.isOrdoDirectory(target) && target.path !== "/" && target.path !== "/.trash/",
    })

    // Create -----------------------------------------------------------------

    // Create file ------------------------------------------------------------

    const CREATE_FILE_COMMAND = commands.on("show-create-file-modal", showCreateFileModal)

    registerContextMenuItem(CREATE_FILE_COMMAND, {
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
