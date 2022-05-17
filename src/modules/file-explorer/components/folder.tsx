import React from "react";
import { Either } from "or-else";

import { useAppDispatch } from "@core/state/store";
import { OrdoFolder } from "@modules/file-explorer/types";
import { Creator } from "@modules/file-explorer/components/creator";
import { useFolderIcons } from "@modules/file-explorer/hooks/use-folder-icons";
import { useTreeNesting } from "@modules/file-explorer/hooks/use-tree-nesting";
import { FolderContent } from "@modules/file-explorer/components/folder-content";
import { tapPreventDefault, tapStopPropagation } from "@utils/events";
import { FoldVoid } from "@utils/either";
import { NoOp } from "@utils/no-op";

type FolderProps = {
	folder: OrdoFolder;
};

/**
 * Collapsible and expandable representation of a folder inside the project.
 */
export const Folder: React.FC<FolderProps> = ({ folder }) => {
	const dispatch = useAppDispatch();

	const { FolderIcon, CollapseIcon } = useFolderIcons(folder);
	const paddingLeft = useTreeNesting(folder.depth);

	const [iconClassName, setIconClassName] = React.useState<string>("file-explorer_folder_green");

	React.useEffect(() => {
		setIconClassName(`file-explorer_folder_${folder.color}`);
	}, [folder]);

	const handleDragLeave = (event: React.MouseEvent) =>
		Either.right(event)
			.map(tapPreventDefault)
			.map(tapStopPropagation)
			.map((e) => e.currentTarget.classList.remove("bg-gray-300"))
			.fold(...FoldVoid);

	const handleDragOver = (event: React.MouseEvent) =>
		Either.right(event)
			.map(tapPreventDefault)
			.map(tapStopPropagation)
			.map((e) => e.currentTarget.classList.add("bg-gray-300"))
			.fold(...FoldVoid);

	const handleDrop = (event: React.DragEvent) =>
		Either.right(event)
			.map(tapPreventDefault)
			.map(tapStopPropagation)
			.map((e) => ({ name: e.dataTransfer.getData("fileName"), oldPath: e.dataTransfer.getData("oldPath") }))
			.map(({ name, oldPath }) => ({ name, oldPath, newFolder: folder.path }))
			.map((payload) => dispatch({ type: "@file-explorer/move", payload }))
			.fold(...FoldVoid);

	const handleDragStart = (event: React.DragEvent) => {
		event.dataTransfer.setData("oldPath", folder.path);
		event.dataTransfer.setData("fileName", folder.readableName);
	};

	const handleContextMenu = (e: React.MouseEvent) =>
		dispatch({
			type: "@file-explorer/show-folder-context-menu",
			payload: { path: folder.path, x: e.clientX, y: e.clientY },
		});

	const handleClick = () => dispatch({ type: "@file-explorer/toggle-folder", payload: folder.path });

	return Either.fromNullable(folder).fold(NoOp, () => (
		<div onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop} title={folder.path}>
			<div
				className="file-explorer_item"
				draggable={true}
				style={{ paddingLeft }}
				onClick={handleClick}
				onContextMenu={handleContextMenu}
				onDragStart={handleDragStart}
			>
				<CollapseIcon />
				<FolderIcon className={iconClassName} />
				<div className="file-explorer_item_name">{folder.readableName}</div>
			</div>

			<Creator path={folder.path} depth={folder.depth} />

			<FolderContent folder={folder} />
		</div>
	));
};
