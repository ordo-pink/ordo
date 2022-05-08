import React from "react";

import { OrdoFile } from "@modules/file-explorer/types";
import { useAppDispatch } from "@core/state/store";
import { useFileIcon } from "@modules/file-explorer/hooks/use-file-icon";

import "@modules/top-bar/components/file.css";

type FileProps = {
	path: string;
	readableName: string;
	relativePath: string;
	size: number;
	type: string;
	selected: number;
	index: number;
	setSelected: React.Dispatch<React.SetStateAction<number>>;
};

export const File: React.FC<FileProps> = ({
	path,
	readableName,
	relativePath,
	size,
	type,
	selected,
	index,
	setSelected,
}) => {
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

	const handleMouseOver = () => setSelected(index);
	const handleClick = () => dispatch({ type: "@editor/open-tab", payload: path });

	return (
		<div
			className={`top-bar-file ${isSelected && "top-bar-selected-file"}`}
			onMouseOver={handleMouseOver}
			onClick={handleClick}
		>
			<div className="top-bar-file-info">
				<Icon className="top-bar-file-icon" />
				<div className="top-bar-file-name">{readableName}</div>
			</div>
		</div>
	);
};
