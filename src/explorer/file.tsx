import React from "react";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { getFileIcon } from "../common/get-file-icon";
import { addTab } from "../editor/state";
import { OrdoFile } from "./types";
import { select } from "../redux/store";

export const File: React.FC<{ file: OrdoFile }> = ({ file }) => {
	const Icon = getFileIcon(file);

	const selected = useAppSelector((state) => state.explorerSelection);
	const dispatch = useAppDispatch();

	return (
		<div
			style={{ paddingLeft: (file.depth + 0.25) * 12 + "px" }}
			className={`flex space-x-2 items-center ${selected === file.path && "bg-gray-300"}`}
			onClick={() => {
				dispatch(select(file.path));
				dispatch(addTab(file.path));
			}}
		>
			<Icon className="shrink-0 text-gray-500" />
			<div className="pr-2 truncate text-gray-700 py-0.5">{file.readableName}</div>
		</div>
	);
};
