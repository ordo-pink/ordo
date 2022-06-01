import React from "react";
import { Either } from "or-else";

import { useAppDispatch, useAppSelector } from "@core/state/store";
import { OrdoFile } from "@modules/file-explorer/types";
import { useFileIcon } from "@modules/file-explorer/hooks/use-file-icon";
import { useTreeNesting } from "@modules/file-explorer/hooks/use-tree-nesting";
import { tapPreventDefault, tapStopPropagation } from "@utils/events";
import { FoldVoid } from "@utils/either";

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
	const paddingLeft = useTreeNesting(file.depth);

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
		Either.of(e)
			.map(tapPreventDefault)
			.map(tapStopPropagation)
			.map(() =>
				dispatch({
					type: "@file-explorer/show-file-context-menu",
					payload: { path: file.path, x: e.clientX, y: e.clientY },
				}),
			)
			.fold(...FoldVoid);

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
			<Icon
				className={`file-explorer_item_icon ${
					file.frontmatter && file.frontmatter.color
						? `text-${file.frontmatter.color}-600 dark:text-${file.frontmatter.color}-300`
						: "text-neutral-500 dark:text-neutral-300"
				}`}
			/>
			<div className="file-explorer_item_name">{file.readableName}</div>
		</div>
	);
};
