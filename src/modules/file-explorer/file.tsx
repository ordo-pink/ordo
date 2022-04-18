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
		</div>
	);
};
