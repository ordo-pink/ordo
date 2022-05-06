import { useAppDispatch, useAppSelector } from "@core/state/store";
import React from "react";
import { OrdoFile } from "../types";
import { getFileIcon } from "@modules/file-explorer/utils/get-icon";

export const File: React.FC<{ file: OrdoFile }> = ({ file }) => {
	const dispatch = useAppDispatch();

	const selectedFile = useAppSelector((state) => state.editor.currentTab);
	const openFiles = useAppSelector((state) => state.editor.tabs);

	const selectionClass =
		selectedFile === file.path
			? "bg-neutral-300 dark:bg-pink-700 border-neutral-500"
			: openFiles.some((f) => f.path === file.path)
			? "bg-neutral-300 dark:bg-neutral-700"
			: "";

	const Icon = getFileIcon(file);

	return (
		<div
			style={{ paddingLeft: (file.depth + 0.25) * 16 + 10 + "px" }}
			className={`flex space-x-2 cursor-pointer border border-transparent items-center select-none hover:bg-neutral-300 dark:hover:bg-neutral-700 ${selectionClass}`}
			onClick={() => dispatch({ "@editor/open-tab": file.path })}
			onContextMenu={(e) =>
				dispatch({ "@file-explorer/show-file-context-menu": { path: file.path, x: e.clientX, y: e.clientY } })
			}
			draggable={true}
			onDragStart={(event: any) => {
				event.dataTransfer.setData("oldPath", file.path);
				event.dataTransfer.setData("fileName", file.readableName);
			}}
		>
			<Icon className="shrink-0 text-neutral-500" />
			<div className="pr-2 truncate">{file.readableName}</div>
		</div>
	);
};
