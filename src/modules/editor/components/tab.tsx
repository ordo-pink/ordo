import React from "react";

import { useAppDispatch, useAppSelector } from "@core/state/store";
import { findOrdoFile } from "@modules/file-explorer/utils/find-ordo-file";
import { EditorTab } from "@modules/editor/types";
import { useFileIcon } from "@modules/file-explorer/hooks/use-file-icon";
import { useIcon } from "@core/hooks/use-icon";

export const Tab: React.FC<{ tab: EditorTab }> = ({ tab }) => {
	const dispatch = useAppDispatch();

	const currentTab = useAppSelector((state) => state.editor.currentTab);
	const tree = useAppSelector((state) => state.fileExplorer.tree);
	const file = findOrdoFile(tree, "path", tab.path);

	const HiX = useIcon("HiX");
	const Icon = useFileIcon(file);

	const closeTab = React.useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();

			dispatch({ type: "@editor/close-tab", payload: file?.path || "" });
		},
		[file],
	);

	return file ? (
		<div
			key={file.path}
			className={`flex flex-shrink text-sm text-neutral-800 dark:text-neutral-300 items-center space-x-2 cursor-pointer px-3 py-1 rounded-lg truncate ${
				currentTab === file.path && "bg-neutral-200 dark:bg-neutral-600 shadow-md"
			}`}
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();

				dispatch({ type: "@editor/open-tab", payload: file.path });
			}}
			onMouseDown={(e) => (e.button === 1 ? closeTab(e) : void 0)}
		>
			<Icon className="text-neutral-500" />
			<div>{file.readableName}</div>
			<HiX className="text-neutral-500 hover:text-red-500" onClick={closeTab} />
		</div>
	) : null;
};
