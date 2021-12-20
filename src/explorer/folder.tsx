import React from "react";
import { getCollapseIcon, getFolderIcon } from "../common/get-folder-icon";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { select, updateFolder } from "./state";
import { OrdoFolder, OrdoFile } from "./types";
import { File } from "./file";

export const Folder: React.FC<{ folder: OrdoFolder }> = ({ folder }) => {
	const Icon = folder && getCollapseIcon(folder);
	const FolderIcon = folder && getFolderIcon(folder);

	const selected = useAppSelector((state) => state.explorer.selected);
	const dispatch = useAppDispatch();

	return (
		folder && (
			<>
				<div
					style={{ paddingLeft: folder.depth * 12 + "px" }}
					className={`flex space-x-2 items-center ${selected === folder.path && "bg-gray-300"}`}
					onClick={() => {
						dispatch(select(folder.path));
						dispatch(updateFolder({ path: folder.path, update: { collapsed: !folder.collapsed } }));
					}}
				>
					<Icon />
					<FolderIcon className={`text-gray-500 text-${folder.color}-500`} />
					<div className="pr-2 truncate text-gray-700 py-0.5">{folder.readableName}</div>
				</div>
				{!folder.collapsed &&
					folder.children.map((child) => (
						<div key={child.path}>
							{child.type === "folder" ? <Folder folder={child as OrdoFolder} /> : <File file={child as OrdoFile} />}
						</div>
					))}
			</>
		)
	);
};
