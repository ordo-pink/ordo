import React from "react";

import { useAppDispatch, useAppSelector } from "@core/state/store";
import { useFolderIcons } from "@modules/file-explorer/hooks/use-folder-icons";
import { useIcon } from "@core/hooks/use-icon";

import "@modules/file-explorer/components/header.css";

export const Header: React.FC = () => {
	const dispatch = useAppDispatch();

	const tree = useAppSelector((state) => state.fileExplorer.tree);

	const { CollapseIcon } = useFolderIcons(tree);
	const HiOutlineDocumentAdd = useIcon("HiOutlineDocumentAdd");
	const HiOutlineFolderAdd = useIcon("HiOutlineFolderAdd");

	const handleClick = () => dispatch({ type: "@file-explorer/toggle-folder", payload: tree.path });
	const handleFileClick = () => dispatch({ type: "@file-explorer/show-file-creation", payload: tree.path });
	const handleFolderClick = () => dispatch({ type: "@file-explorer/show-folder-creation", payload: tree.path });

	return tree ? (
		<>
			<div className="header" onClick={handleClick}>
				<CollapseIcon />
				<div className="project-name">{tree.readableName}</div>
			</div>
			<div className="header-actions">
				<HiOutlineDocumentAdd onClick={handleFileClick} className="header-action" />
				<HiOutlineFolderAdd onClick={handleFolderClick} className="header-action" />
			</div>
		</>
	) : null;
};
