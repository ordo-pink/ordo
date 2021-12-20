import React from "react";
import { select } from "./state";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { getFileIcon } from "../common/get-file-icon";
import { createTab } from "../editor/state";
import { OrdoFile } from "./types";

export const File: React.FC<{ file: OrdoFile }> = ({ file }) => {
	const Icon = getFileIcon(file);

	const selected = useAppSelector((state) => state.explorer.selected);
	const dispatch = useAppDispatch();

	return (
		<div
			style={{ paddingLeft: (file.depth + 0.25) * 12 + "px" }}
			className={`flex space-x-2 items-center ${selected === file.path && "bg-gray-300"}`}
			onClick={() => {
				dispatch(select(file.path));
				dispatch(createTab(file));
			}}
		>
			<Icon className="shrink-0 text-gray-500" />
			<div className="pr-2 truncate text-gray-700 py-0.5">{file.readableName}</div>
		</div>
	);
};
