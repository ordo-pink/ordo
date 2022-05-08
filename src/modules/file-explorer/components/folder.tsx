import React from "react";

import { OrdoFolder, OrdoFile } from "@modules/file-explorer/types";
import { File } from "@modules/file-explorer/components/file";
import { Creator } from "@modules/file-explorer/components/creator";
import { useAppDispatch } from "@core/state/store";
import { useFolderIcons } from "@modules/file-explorer/hooks/use-folder-icons";
import { useTreePadding } from "@modules/file-explorer/hooks/use-tree-padding";

import "@modules/file-explorer/components/folder.css";

type FolderProps = {
	folder: OrdoFolder;
};

export const Folder: React.FC<FolderProps> = ({ folder }) => {
	const dispatch = useAppDispatch();

	const { FolderIcon, CollapseIcon } = useFolderIcons(folder);
	const paddingLeft = useTreePadding(folder.depth);

	const [color, setColor] = React.useState<string>("");

	React.useEffect(() => {
		setColor(`text-${folder.color}-600 dark:text-${folder.color}-300`);
	}, [folder]);

	const handleDragLeave = (event: React.MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();

		event.currentTarget.classList.remove("bg-gray-300");
	};

	const handleDragOver = (event: React.MouseEvent) => {
		event.preventDefault();
		event.stopPropagation();

		event.currentTarget.classList.add("bg-gray-300");
	};

	const handleDrop = (event: React.DragEvent) => {
		event.preventDefault();
		event.stopPropagation();

		const fileName = event.dataTransfer.getData("fileName");
		const oldPath = event.dataTransfer.getData("oldPath");
		event.dataTransfer.clearData();

		dispatch({ type: "@file-explorer/move", payload: { oldPath, newFolder: folder.path, name: fileName } });

		event.currentTarget.classList.remove("bg-gray-300");
	};

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

	return (
		folder && (
			<div onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop} title={folder.path}>
				<div
					className="folder"
					draggable={true}
					style={{ paddingLeft }}
					onClick={handleClick}
					onContextMenu={handleContextMenu}
					onDragStart={handleDragStart}
				>
					<CollapseIcon />
					<FolderIcon className={`folder-icon ${color}`} />
					<div className="folder-name">{folder.readableName}</div>
				</div>
				{!folder.collapsed ? (
					<div>
						<Creator path={folder.path} depth={folder.depth} />
						{folder.children.map((child) => (
							<div key={child.path}>
								{child.type === "folder" ? <Folder folder={child as OrdoFolder} /> : <File file={child as OrdoFile} />}
							</div>
						))}
					</div>
				) : null}
			</div>
		)
	);
};
