import React from "react";
import { HiX } from "react-icons/hi";

import { useAppDispatch, useAppSelector } from "@core/state/store";
import { findOrdoFile } from "@modules/file-explorer/utils/find-ordo-file";
import { getFileIcon } from "@modules/file-explorer/utils/get-icon";
import { EditorTab } from "@modules/editor/types";

export const Tab: React.FC<{ tab: EditorTab }> = ({ tab }) => {
	const dispatch = useAppDispatch();

	const currentTab = useAppSelector((state) => state.editor.currentTab);
	const tree = useAppSelector((state) => state.fileExplorer.tree);

	if (!tree) {
		return null;
	}

	const file = findOrdoFile(tree, "path", tab.path);

	if (!file) {
		return null;
	}

	const Icon = getFileIcon(file);
	const closeTab = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		dispatch({ "@editor/close-tab": file.path });
	};
	return (
		<div
			key={file.path}
			className={`flex flex-shrink text-sm text-neutral-800 dark:text-neutral-300 items-center space-x-2 cursor-pointer px-3 py-1 rounded-lg truncate ${
				currentTab === file.path && "bg-neutral-200 dark:bg-neutral-600 shadow-md"
			}`}
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();
				dispatch({ "@editor/open-tab": file.path });
			}}
			onMouseDown={(e) => (e.button === 1 ? closeTab(e) : void 0)}
		>
			<Icon className="text-neutral-500" />
			<div>{file.readableName}</div>
			<HiX className="text-neutral-500 hover:text-red-500" onClick={closeTab} />
		</div>
	);
};
