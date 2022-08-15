import React from "react";

import { OrdoFile, OrdoFolder } from "@modules/file-explorer/types";
import { Folder } from "@modules/file-explorer/components/folder";
import { File } from "@modules/file-explorer/components/file";
import { fromBoolean } from "@utils/either";
import { NoOp } from "@utils/no-op";

type FolderContentProps = {
  folder: OrdoFolder;
};

/**
 * Displays contents of the folder.
 */
export const FolderContent: React.FC<FolderContentProps> = ({ folder }) =>
  fromBoolean(!folder.collapsed).fold(NoOp, () => (
    <>
      {folder.children.map((child) =>
        fromBoolean(child.type === "folder").fold(
          () => <File key={child.path} file={child as OrdoFile} />,
          () => <Folder key={child.path} folder={child as OrdoFolder} />,
        ),
      )}
    </>
  ));
