import React from "react";

import { useAppDispatch, useAppSelector } from "@core/state/store";

export const Creator: React.FC<{ path: string; depth: number }> = ({ path, depth }) => {
	const dispatch = useAppDispatch();

	const { createFileIn, createFolderIn } = useAppSelector((state) => state.fileExplorer);
	const [name, setName] = React.useState("");

	const createHere = createFileIn === path || createFolderIn === path;

	return (
		<div>
			{createHere ? (
				<input
					type="text"
					className="px-1 outline-none border border-neutral-400 dark:bg-neutral-700"
					style={{
						width: `calc(100% - ${depth ? depth * 16 + 16 + "px" : "0px"})`,
						marginLeft: depth ? depth * 16 + 16 + "px" : "0px",
					}}
					autoFocus={createHere}
					value={name}
					onChange={(e) => setName(e.target.value)}
					onFocus={() => {
						dispatch({ "@editor/unfocus": null });
					}}
					onBlur={() => {
						dispatch({ "@editor/focus": null });
						dispatch({ "@file-explorer/hide-creation": null });
						setName("");
					}}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							dispatch({ [createFileIn ? "@file-explorer/create-file" : "@file-explorer/create-folder"]: name });
							setName("");
						} else if (e.key === "Escape") {
							dispatch({ "@editor/focus": null });
							dispatch({ "@file-explorer/hide-creation": null });
							setName("");
						}
					}}
					onSubmit={() => dispatch({ [createFileIn ? "@file-explorer/create-file" : "@file-explorer/create-folder"]: name })}
				/>
			) : null}
		</div>
	);
};
