import React from "react";
import Scrollbars from "react-custom-scrollbars";

import { useAppSelector } from "@core/store-hooks";
import { OrdoFile, OrdoFolder } from "@modules/application/types";
import { File } from "@modules/file-explorer/file";
import { Folder } from "@modules/file-explorer/folder";
import { Header } from "@modules/file-explorer/header";

export const FileExplorer: React.FC = () => {
	const tree = useAppSelector((state) => state.application.tree);

	const createFileIn = useAppSelector((state) => state.application.createFileIn);
	const createFolderIn = useAppSelector((state) => state.application.createFolderIn);

	const [name, setName] = React.useState("");

	if (!tree) {
		return null;
	}

	const createHere = createFileIn === tree.path || createFolderIn === tree.path;

	return (
		<>
			<div className="flex w-full items-center justify-between bg-gray-200 py-1 px-3 rounded-t-lg">
				<Header />
			</div>
			<div className=" h-[97.7%]">
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
						onSubmit={() => window.ordo.emit(createFileIn ? "@application/create-file" : "@application/create-folder", name)}
					/>
				) : null}
				{tree.collapsed ? null : (
					<Scrollbars>
						<div>
							{tree.children.map((child) => (
								<div className="cursor-pointer" key={child.path}>
									{child.type === "folder" ? <Folder folder={child as OrdoFolder} /> : <File file={child as OrdoFile} />}
								</div>
							))}
						</div>
					</Scrollbars>
				)}
			</div>
		</>
	);
};
