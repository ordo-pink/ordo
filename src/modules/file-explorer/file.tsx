import { useAppDispatch, useAppSelector } from "@core/state/hooks";
import { openTab, OrdoFile } from "@modules/editor/editor-slice";
import { getFileIcon } from "@utils/get-icon";
import React from "react";

export const File: React.FC<{ file: OrdoFile }> = ({ file }) => {
	const dispatch = useAppDispatch();
	const selectedFile = useAppSelector((state) => state.editor.currentTab);
	const openFiles = useAppSelector((state) => state.editor.tabs);

	const selectionClass =
		selectedFile === file.path
			? "bg-neutral-300 dark:bg-neutral-700"
			: openFiles.some((f) => f.path === file.path)
			? "border border-neutral-300 dark:border-neutral-700"
			: "";

	const Icon = getFileIcon(file);

	return (
		<div
			style={{ paddingLeft: (file.depth + 0.25) * 16 + "px" }}
			className={`flex space-x-2 items-center ${selectionClass}`}
			onClick={() => dispatch(openTab(file.path))}
		>
			<Icon className="shrink-0 text-neutral-500" />
			<div className="pr-2 truncate text-neutral-700 dark:text-neutral-400 py-0.5">{file.readableName}</div>
		</div>
	);
};
