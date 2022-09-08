import React from "react";
import { Either } from "or-else";

import { useAppDispatch, useAppSelector } from "@core/state/store";
import { useFolderIcons } from "@modules/file-explorer/hooks/use-folder-icons";
import { useIcon } from "@core/hooks/use-icon";
import { NoOp } from "@utils/functions";

/**
 * Displays the project name and allows collapsing the whole project in one click.
 * Action buttons allow creating a folder or a file at the root level of the project.
 */
export const Header: React.FC = () => {
  const dispatch = useAppDispatch();

  const tree = useAppSelector((state) => state.fileExplorer.tree);

  const { CollapseIcon } = useFolderIcons(tree);
  const HiOutlineDocumentAdd = useIcon("HiOutlineDocumentAdd");
  const HiOutlineFolderAdd = useIcon("HiOutlineFolderAdd");

  const handleClick = () => dispatch({ type: "@file-explorer/toggle-folder", payload: tree.path });
  const handleFileClick = () => dispatch({ type: "@file-explorer/show-file-creation", payload: tree.path });
  const handleFolderClick = () => dispatch({ type: "@file-explorer/show-folder-creation", payload: tree.path });

  return Either.fromNullable(tree).fold(NoOp, () => (
    <div className="file-explorer_header">
      <div className="file-explorer_header_title" onClick={handleClick}>
        <CollapseIcon />
        <div className="file-explorer_header_project-name">{tree.readableName}</div>
      </div>
      <div className="file-explorer_header_actions">
        <HiOutlineDocumentAdd onClick={handleFileClick} className="file-explorer_header_action" />
        <HiOutlineFolderAdd onClick={handleFolderClick} className="file-explorer_header_action" />
      </div>
    </div>
  ));
};
