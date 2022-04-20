import React from "react";
import { OrdoFile } from "@modules/file-explorer/types";
import { getFileIcon } from "@modules/file-explorer/utils/get-icon";

export const File: React.FC<{
	path: string;
	readableName: string;
	relativePath: string;
	size: number;
	type: string;
	selected: number;
	index: number;
	setSelected: React.Dispatch<React.SetStateAction<number>>;
}> = ({ path, readableName, relativePath, size, type, selected, index, setSelected }) => {
	const Icon = getFileIcon({ size, type } as OrdoFile);
	const isSelected = selected === index;
	const folder = relativePath.replace(readableName, "").slice(2, -1);

	return (
		<div
			className={`flex space-x-2 text-sm px-2 py-1 last-of-type:rounded-b-lg cursor-pointer select-none ${
				isSelected && "bg-neutral-200 dark:bg-neutral-700"
			}`}
			onMouseOver={() => setSelected(index)}
			onClick={() => window.ordo.emit("@editor/open-tab", path)}
		>
			<div className="flex-grow">
				<div className="flex items-center space-x-2">
					<Icon className="text-neutral-500 flex-shrink-0" />
					<div className="flex w-full justify-between items-center">
						<div className="truncate w-4/6">{readableName}</div>
						<div className="truncate w-2/6 text-right text-neutral-500 ml-2">{folder}</div>
					</div>
				</div>
			</div>
		</div>
	);
};
