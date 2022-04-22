import React from "react";

import { OrdoFolder, OrdoFile } from "@modules/file-explorer/types";
import { File } from "@modules/file-explorer/components/file";
import { getCollapseIcon, getFolderIcon } from "@modules/file-explorer/utils/get-icon";
import { Creator } from "./creator";

export const Folder: React.FC<{ folder: OrdoFolder }> = ({ folder }) => {
	const Icon = folder && getCollapseIcon(folder);
	const FolderIcon = folder && getFolderIcon(folder);

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

					window.ordo.emit("@file-explorer/move", { oldPath, newFolder: folder.path, name: fileName });

					event.currentTarget.classList.remove("bg-gray-300");
				}}
			>
				<div
					style={{ paddingLeft: folder.depth * 12 + 10 + "px" }}
					className={`flex space-x-2 items-center select-none hover:bg-neutral-300 dark:hover:bg-neutral-700 cursor-pointer`}
					onClick={() => window.ordo.emit("@file-explorer/toggle-folder", folder.path)}
					onContextMenu={(e) =>
						window.ordo.emit("@file-explorer/show-folder-context-menu", { path: folder.path, x: e.clientX, y: e.clientY })
					}
					draggable={true}
					onDragStart={(event: any) => {
						event.dataTransfer.setData("oldPath", folder.path);
						event.dataTransfer.setData("fileName", folder.readableName);
					}}
				>
					<Icon />
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
