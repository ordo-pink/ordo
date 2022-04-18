import React from "react";

import { useAppSelector } from "@core/state/store";

export const Creator: React.FC = () => {
	const { tree, createFileIn, createFolderIn } = useAppSelector((state) => state.fileExplorer);
	const [name, setName] = React.useState("");

	if (!tree) {
		return null;
	}

	const createHere = createFileIn === tree.path || createFolderIn === tree.path;

	return (
		<div>
			{createHere ? (
				<input
					type="text"
					className="w-full px-1 py-0.5 outline-none border border-neutral-400 bg-neutral-600"
					autoFocus={createHere}
					value={name}
					onChange={(e) => setName(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							window.ordo.emit(createFileIn ? "@file-explorer/create-file" : "@file-explorer/create-folder", name);
							setName("");
						} else if (e.key === "Escape") {
							window.ordo.emit("@file-explorer/hide-creation", null);
							setName("");
						}
					}}
					onSubmit={() =>
						window.ordo.emit(createFileIn ? "@file-explorer/create-file" : "@file-explorer/create-folder", name)
					}
				/>
			) : null}
		</div>
	);
};
