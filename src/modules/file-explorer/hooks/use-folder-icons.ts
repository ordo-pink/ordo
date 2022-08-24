import React from "react";

import { OrdoFolder } from "@modules/file-explorer/types";
import { useIcon } from "@core/hooks/use-icon";
import { SupportedIcon } from "@core/types";

export const useFolderIcons = (folder: OrdoFolder) => {
  const collapseIcon: SupportedIcon = React.useMemo(
    () => (folder.collapsed ? "HiOutlineChevronRight" : "HiOutlineChevronDown"),
    [folder.path, folder.collapsed],
  );

  const folderIcon = React.useMemo(() => {
    if (folder.collapsed && folder.children.length > 0) return "HiFolder";
    if (folder.collapsed && folder.children.length === 0) return "HiOutlineFolder";
    if (!folder.collapsed && folder.children.length > 0) return "HiFolderOpen";
    return "HiOutlineFolderOpen";
  }, [folder.path, folder.collapsed, folder.children.length]);

  const CollapseIcon = useIcon(collapseIcon);
  const FolderIcon = useIcon(folderIcon);

  return { FolderIcon, CollapseIcon };
};
