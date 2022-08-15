import { OrdoFile, OrdoFolder } from "@modules/file-explorer/types";
import { isFolder } from "@modules/file-explorer/utils/is-folder";

export const collectFiles = (tree: OrdoFolder, files: OrdoFile[] = []) => {
  tree.children.forEach((child) => {
    if (isFolder(child)) {
      collectFiles(child, files);
    } else {
      files.push(child);
    }
  });

  return files;
};
