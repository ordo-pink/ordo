import { useAppSelector } from "@core/state/store";
import React from "react";
import { OrdoFile } from "../types";
import { getFileIcon } from "@modules/file-explorer/utils/get-icon";

export const File: React.FC<{ file: OrdoFile }> = ({ file }) => {
	// const selectedFile = useAppSelector((state) => state.editor.currentTab);
	// const openFiles = useAppSelector((state) => state.editor.tabs);

	// const selectionClass =
	// 	selectedFile === file.path
	// 		? "bg-neutral-300 dark:bg-pink-700"
	// 		: // : openFiles.some((f) => f.path === file.path)
	// 		  // ? "bg-sky-50 dark:bg-zinc-700"
	// 		  "";

	const Icon = getFileIcon(file);

	return (
		<div
			style={{ paddingLeft: (file.depth + 0.25) * 16 + 10 + "px" }}
			className={`flex space-x-2 cursor-pointer items-center select-none hover:bg-neutral-300 dark:hover:bg-neutral-700 ${"selectionClass"}`}
			// onClick={() => dispatch(openTab(file.path))}
		>
			<Icon className="shrink-0" />
			<div className="pr-2 truncate py-0.5">{file.readableName}</div>
		</div>
	);
};
