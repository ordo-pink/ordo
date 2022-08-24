import { OrdoEventHandler } from "@core/types";

/**
 * Hides file/folder creation input and resets its value.
 */
export const handleHideCreation: OrdoEventHandler<"@file-explorer/hide-creation"> = ({ draft }) => {
  draft.fileExplorer.createFileIn = "";
  draft.fileExplorer.createFolderIn = "";
};
