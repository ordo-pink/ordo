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
			<>
				<div
					style={{ paddingLeft: folder.depth * 12 + 10 + "px" }}
					className={`flex space-x-2 items-center select-none hover:bg-neutral-300 dark:hover:bg-neutral-700 cursor-pointer`}
					onClick={() => {
						window.ordo.emit("@file-explorer/toggle-folder", folder.path);
					}}
				>
					<Icon />
					<FolderIcon className={`text-${folder.color}-500 dark:text-${folder.color}-300`} />
					<div className="pr-2 truncate py-0.5">{folder.readableName}</div>
				</div>
				{!folder.collapsed && (
					<div>
						<Creator />
						{folder.children.map((child) => (
							<div key={child.path}>
								{child.type === "folder" ? <Folder folder={child as OrdoFolder} /> : <File file={child as OrdoFile} />}
							</div>
						))}
					</div>
				)}
			</>
		)
	);
};
