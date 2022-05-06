import React from "react";

import { OrdoFolder, OrdoFile } from "@modules/file-explorer/types";
import { File } from "@modules/file-explorer/components/file";
import { Creator } from "@modules/file-explorer/components/creator";
import { useAppDispatch } from "@core/state/store";
import { useFolderIcons } from "@modules/file-explorer/hooks/use-folder-icons";

export const Folder: React.FC<{ folder: OrdoFolder }> = ({ folder }) => {
	const dispatch = useAppDispatch();

	const { FolderIcon, CollapseIcon } = useFolderIcons(folder);

	return (
		folder && (
			<div
				onDragLeave={(event) => {
					event.preventDefault();
					event.stopPropagation();

					event.currentTarget.classList.remove("bg-gray-300");
				}}
				onDragOver={(event) => {
					event.preventDefault();
					event.stopPropagation();

					event.currentTarget.classList.add("bg-gray-300");
				}}
				onDrop={(event) => {
					event.preventDefault();
					event.stopPropagation();

					const fileName = event.dataTransfer.getData("fileName");
					const oldPath = event.dataTransfer.getData("oldPath");
					event.dataTransfer.clearData();

					dispatch({ type: "@file-explorer/move", payload: { oldPath, newFolder: folder.path, name: fileName } });

					event.currentTarget.classList.remove("bg-gray-300");
				}}
			>
				<div
					style={{ paddingLeft: folder.depth * 12 + 10 + "px" }}
					className={`flex space-x-2 items-center select-none hover:bg-neutral-300 dark:hover:bg-neutral-700 cursor-pointer`}
					onClick={() => dispatch({ type: "@file-explorer/toggle-folder", payload: folder.path })}
					onContextMenu={(e) =>
						dispatch({
							type: "@file-explorer/show-folder-context-menu",
							payload: { path: folder.path, x: e.clientX, y: e.clientY },
						})
					}
					draggable={true}
					onDragStart={(event: any) => {
						event.dataTransfer.setData("oldPath", folder.path);
						event.dataTransfer.setData("fileName", folder.readableName);
					}}
				>
					<CollapseIcon />
					<FolderIcon className={`text-${folder.color}-500 dark:text-${folder.color}-300`} />
					<div className="pr-2 truncate">{folder.readableName}</div>
				</div>
				{!folder.collapsed && (
					<div>
						<Creator path={folder.path} depth={folder.depth} />
						{folder.children.map((child) => (
							<div key={child.path}>
								{child.type === "folder" ? <Folder folder={child as OrdoFolder} /> : <File file={child as OrdoFile} />}
							</div>
						))}
					</div>
				)}
			</div>
		)
	);
};
