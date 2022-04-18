<<<<<<< HEAD
import React from "react";

import { useAppSelector } from "@core/store-hooks";
import { getFileIcon } from "@modules/application/get-file-icon";
import { OrdoFile } from "@modules/application/types";

export const File: React.FC<{ file: OrdoFile }> = ({ file }) => {
	const Icon = file && getFileIcon(file);

	const selected = useAppSelector((state) => state.application.currentFilePath);

	return (
		<div
			onContextMenu={(e) => {
				window.ordo.emit("@application/show-context-menu", {
					x: e.pageX,
					y: e.pageY,
					item: "file",
					params: { path: file.path },
				});
			}}
			style={{ paddingLeft: (file.depth + 0.25) * 12 + "px" }}
			className={`flex space-x-2 items-center ${selected === file.path && "bg-gray-300"}`}
			onClick={() => {
				window.ordo.emit("@application/open-file", file.path);
			}}
		>
			<Icon className="shrink-0 text-gray-500" />
			<div className="pr-2 truncate text-gray-700 py-0.5">{file.readableName}</div>
=======
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
			? "bg-neutral-300 dark:bg-pink-700"
			: // : openFiles.some((f) => f.path === file.path)
			  // ? "bg-sky-50 dark:bg-zinc-700"
			  "";

	const Icon = getFileIcon(file);

	return (
		<div
			style={{ paddingLeft: (file.depth + 0.25) * 16 + 10 + "px" }}
			className={`flex space-x-2 cursor-pointer items-center select-none hover:bg-neutral-300 ${selectionClass}`}
			onClick={() => dispatch(openTab(file.path))}
		>
			<Icon className="shrink-0 text-neutral-500" />
			<div className="pr-2 truncate text-neutral-700 dark:text-neutral-400 py-0.5">{file.readableName}</div>
>>>>>>> ordo-app/main
		</div>
	);
};
