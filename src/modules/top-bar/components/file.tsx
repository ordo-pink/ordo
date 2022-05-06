import React from "react";

import { OrdoFile } from "@modules/file-explorer/types";
import { useAppDispatch } from "@core/state/store";
import { useFileIcon } from "@modules/file-explorer/hooks/use-file-icon";

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
	const dispatch = useAppDispatch();

	const Icon = useFileIcon({ size, type } as OrdoFile);
	const [isSelected, setIsSelected] = React.useState<boolean>(false);
	const [folder, setFolder] = React.useState<string>("");

	React.useEffect(() => {
		setIsSelected(selected === index);
	}, [selected, index]);

	React.useEffect(() => {
		setFolder(relativePath.replace(readableName, "").slice(1, -1));
	}, [relativePath, readableName]);

	return (
		<div
			className={`flex space-x-2 text-sm px-2 py-1 first-of-type:rounded-t-lg last-of-type:rounded-b-lg cursor-pointer select-none ${
				isSelected && "bg-neutral-200 dark:bg-neutral-700"
			}`}
			onMouseOver={() => setSelected(index)}
			onClick={() => dispatch({ type: "@editor/open-tab", payload: path })}
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
