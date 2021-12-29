import React from "react";
import { getCollapseIcon, getFolderIcon } from "../common/get-folder-icon";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { OrdoFolder, OrdoFile } from "./types";
import { File } from "./file";
import {
	createFile,
	createFolder,
	select,
	setEditorSelection,
	setShowCreateFile,
	setShowCreateFolder,
	updateFolder,
} from "../redux/store";

export const Folder: React.FC<{ folder: OrdoFolder }> = ({ folder }) => {
	const Icon = folder && getCollapseIcon(folder);
	const FolderIcon = folder && getFolderIcon(folder);

	const [createdName, setCreatedName] = React.useState("");

	const selected = useAppSelector((state) => state.explorerSelection);
	const showCreateFile = useAppSelector((state) => state.showCreateFile);
	const showCreateFolder = useAppSelector((state) => state.showCreateFolder);
	const showInput = (showCreateFolder || showCreateFile) && selected === folder.path;

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
				{showInput && (
					<input
						style={{ marginLeft: (folder.depth + 1.25) * 12 + "px" }}
						autoFocus={showInput}
						className="w-full"
						type="text"
						onFocus={() => dispatch(setEditorSelection(false))}
						value={createdName}
						onKeyDown={(e) => {
							if (e.key === "Escape") {
								e.preventDefault();

								dispatch(setEditorSelection(true));
								dispatch(setShowCreateFile(false));
								dispatch(setShowCreateFolder(false));
								setCreatedName("");
							} else if (e.key === "Enter") {
								e.preventDefault();

								dispatch(
									showCreateFile
										? createFile({ currentlySelectedPath: selected, name: createdName })
										: createFolder({ currentlySelectedPath: selected, name: createdName }),
								);

								dispatch(setEditorSelection(true));
								dispatch(setShowCreateFile(false));
								dispatch(setShowCreateFolder(false));

								setCreatedName("");
							}
						}}
						onChange={(e) => setCreatedName(e.target.value)}
					/>
				)}
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
