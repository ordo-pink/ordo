import { registerEvents } from "@core/transmission/register-ordo-events";
import { FileExplorerEvents } from "@modules/file-explorer/types";
import { handleCreateFile } from "@modules/file-explorer/event-handlers/create-file";
import { handleCreateFolder } from "@modules/file-explorer/event-handlers/create-folder";
import { handleToggleFolder } from "@modules/file-explorer/event-handlers/toggle-folder";
import { handleListFolder } from "@modules/file-explorer/event-handlers/list-folder";
import { handleRemoveFile } from "@modules/file-explorer/event-handlers/remove-file";
import { handleRemoveFolder } from "@modules/file-explorer/event-handlers/remove-folder";
import { handleHideCreation } from "@modules/file-explorer/event-handlers/hide-creation";
import { handleShowFileCreation } from "@modules/file-explorer/event-handlers/show-file-creation";
import { handleShowFolderCreation } from "@modules/file-explorer/event-handlers/show-folder-creation";
import { handleShowFolderContextMenu } from "@modules/file-explorer/event-handlers/show-folder-context-menu";
import { handleShowFileContextMenu } from "@modules/file-explorer/event-handlers/show-file-context-menu";
import { handleRevealInFinder } from "@modules/file-explorer/event-handlers/reveal-in-finder";
import { handleCopyPath } from "@modules/file-explorer/event-handlers/copy-path";
import { handleMove } from "@modules/file-explorer/event-handlers/move";
import { handleSetFolderColor } from "@modules/file-explorer/event-handlers/set-folder-color";
import { handleSaveFile } from "@modules/file-explorer/event-handlers/save-file";
import { handleReplaceLine } from "@modules/file-explorer/event-handlers/replace-line";
import { handleRename } from "./event-handlers/rename";

export default registerEvents<FileExplorerEvents>({
  "@file-explorer/copy-path": handleCopyPath,
  "@file-explorer/create-file": handleCreateFile,
  "@file-explorer/create-folder": handleCreateFolder,
  "@file-explorer/hide-creation": handleHideCreation,
  "@file-explorer/list-folder": handleListFolder,
  "@file-explorer/move": handleMove,
  "@file-explorer/remove-file": handleRemoveFile,
  "@file-explorer/remove-folder": handleRemoveFolder,
  "@file-explorer/reveal-in-finder": handleRevealInFinder,
  "@file-explorer/save-file": handleSaveFile,
  "@file-explorer/set-folder-color": handleSetFolderColor,
  "@file-explorer/show-file-context-menu": handleShowFileContextMenu,
  "@file-explorer/show-file-creation": handleShowFileCreation,
  "@file-explorer/show-folder-context-menu": handleShowFolderContextMenu,
  "@file-explorer/show-folder-creation": handleShowFolderCreation,
  "@file-explorer/toggle-folder": handleToggleFolder,
  "@file-explorer/replace-line": handleReplaceLine,
  "@file-explorer/rename": handleRename,
});
