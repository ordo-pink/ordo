import React from "react";

import { useAppDispatch, useAppSelector } from "@core/state/store";
import { OrdoFile } from "@modules/file-explorer/types";
import { useFileIcon } from "@modules/file-explorer/hooks/use-file-icon";
import { useTreePadding } from "@modules/file-explorer/hooks/use-tree-padding";

type FileProps = {
	file: OrdoFile;
};

/**
 * Project file representation in FileExplorer.
 */
export const File: React.FC<FileProps> = ({ file }) => {
	const dispatch = useAppDispatch();

	const selectedFile = useAppSelector((state) => state.editor.currentTab);
	const openFiles = useAppSelector((state) => state.editor.tabs);

	const Icon = useFileIcon(file);
	const paddingLeft = useTreePadding(file.depth);

	const [isOpenFile, setIsOpenFile] = React.useState<boolean>(false);
	const [isCurrentFile, setIsCurrentFile] = React.useState<boolean>(false);

	React.useEffect(() => {
		setIsCurrentFile(selectedFile === file.path);
		setIsOpenFile(openFiles.some((f) => f.path === file.path));
	}, [selectedFile, file, openFiles]);

	const handleClick = () => dispatch({ type: "@editor/open-tab", payload: file.path });
	const handleDragStart = (event: React.DragEvent) => {
		event.dataTransfer.setData("oldPath", file.path);
		event.dataTransfer.setData("fileName", file.readableName);
	};
	const handleContextMenu = (e: React.MouseEvent) =>
		dispatch({
			type: "@file-explorer/show-file-context-menu",
			payload: { path: file.path, x: e.clientX, y: e.clientY },
		});

	return (
		<div
			style={{ paddingLeft }}
			title={file.path}
			draggable={true}
			className={`file-explorer_item ${isOpenFile && "file-explorer_item_open"} ${
				isCurrentFile && "file-explorer_item_current"
			}`}
			onClick={handleClick}
			onContextMenu={handleContextMenu}
			onDragStart={handleDragStart}
		>
			<Icon className="file-explorer_item_icon" />
			<div className="file-explorer_item_name">{file.readableName}</div>
		</div>
	);
};
