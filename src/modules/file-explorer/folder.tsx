import React from "react";

<<<<<<< HEAD
import { OrdoFolder, OrdoFile } from "@modules/application/types";
import { File } from "@modules/file-explorer/file";
import { getCollapseIcon, getFolderIcon } from "@modules/application/get-folder-icon";
import { useAppSelector } from "@core/store-hooks";

export const Folder: React.FC<{ folder: OrdoFolder }> = ({ folder }) => {
	const createFileIn = useAppSelector((state) => state.application.createFileIn);
	const createFolderIn = useAppSelector((state) => state.application.createFolderIn);
=======
import { File } from "@modules/file-explorer/file";
import { useAppDispatch, useAppSelector } from "@core/state/hooks";
import { OrdoFolder, OrdoFile } from "@modules/editor/editor-slice";
import { getCollapseIcon, getFolderIcon } from "@utils/get-icon";
import { toggleFolder } from "./file-explorer-slice";

export const Folder: React.FC<{ folder: OrdoFolder }> = ({ folder }) => {
	const dispatch = useAppDispatch();
	const createFileIn = useAppSelector((state) => state.fileExplorer.createFileIn);
	const createFolderIn = useAppSelector((state) => state.fileExplorer.createFolderIn);
>>>>>>> ordo-app/main
	const Icon = folder && getCollapseIcon(folder);
	const FolderIcon = folder && getFolderIcon(folder);

	const [name, setName] = React.useState("");

	const createHere = createFileIn === folder.path || createFolderIn === folder.path;

	return (
		folder && (
			<>
				<div
<<<<<<< HEAD
					onContextMenu={(e) =>
						window.ordo.emit("@application/show-context-menu", {
							x: e.pageX,
							y: e.pageY,
							item: "folder",
							params: { path: folder.path },
						})
					}
					style={{ paddingLeft: folder.depth * 12 + "px" }}
					className={`flex space-x-2 items-center`}
					onClick={() => {
						window.ordo.emit("@application/update-folder", [folder.path, { collapsed: !folder.collapsed }]);
=======
					style={{ paddingLeft: folder.depth * 12 + 10 + "px" }}
					className={`flex space-x-2 items-center select-none hover:bg-neutral-300 cursor-pointer`}
					onClick={() => {
						dispatch(toggleFolder(folder.path));
>>>>>>> ordo-app/main
					}}
				>
					<Icon />
					<FolderIcon className={`text-${folder.color}-500`} />
					<div className="pr-2 truncate text-gray-700 py-0.5">{folder.readableName}</div>
				</div>
				{!folder.collapsed && (
					<div>
						{createHere ? (
							<input
								type="text"
								className="w-full px-1 py-0.5 outline-none border border-gray-400"
								autoFocus={createHere}
								value={name}
								onChange={(e) => setName(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										window.ordo.emit(createFileIn ? "@application/create-file" : "@application/create-folder", name);
										setName("");
									} else if (e.key === "Escape") {
										window.ordo.emit("@application/hide-creation");
										setName("");
									}
								}}
								onSubmit={() =>
									window.ordo.emit(createFileIn ? "@application/create-file" : "@application/create-folder", name)
								}
							/>
						) : null}
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
