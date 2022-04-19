import React from "react";

import { useAppSelector } from "@core/state/store";

export const Creator: React.FC<{ path: string }> = ({ path }) => {
	const { createFileIn, createFolderIn } = useAppSelector((state) => state.fileExplorer);
	const [name, setName] = React.useState("");

	const createHere = createFileIn === path || createFolderIn === path;

	return (
		<div>
			{createHere ? (
				<input
					type="text"
					className="w-full px-1 py-0.5 outline-none border border-neutral-400"
					autoFocus={createHere}
					value={name}
					onChange={(e) => setName(e.target.value)}
					onBlur={() => {
						window.ordo.emit("@file-explorer/hide-creation", null);
						setName("");
					}}
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
