import { OrdoFolder } from "@modules/file-explorer/types";
import { isFolder } from "@modules/file-explorer/utils/is-folder";

export const sortTree = (tree: OrdoFolder): OrdoFolder => {
  tree.children = tree.children.sort((a, b) => {
    if (isFolder(a)) {
      sortTree(a);
    }

    if (isFolder(b)) {
      sortTree(b);
    }

    if (!isFolder(a) && isFolder(b)) {
      return 1;
    }

    if (isFolder(a) && !isFolder(b)) {
      return -1;
    }

    return a.readableName.localeCompare(b.readableName);
  });

  return tree;
};
