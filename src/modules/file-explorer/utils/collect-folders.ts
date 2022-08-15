import { OrdoFolder } from "@modules/file-explorer/types";
import { isFolder } from "@modules/file-explorer/utils/is-folder";

export const collectFolders = (tree: OrdoFolder, folders: OrdoFolder[] = []) => {
  tree.children.forEach((child) => {
    if (isFolder(child)) {
      folders.push(child);
      collectFolders(child, folders);
    }
  });

  return folders;
};
