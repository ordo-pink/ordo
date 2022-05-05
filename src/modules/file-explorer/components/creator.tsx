import React from "react";

import { useAppSelector } from "@core/state/store";
import { focusEditor, unfocusEditor, useEditorDispatch } from "@modules/editor/state";

export const Creator: React.FC<{ path: string; depth: number }> = ({ path, depth }) => {
	const dispatch = useEditorDispatch();
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
						dispatch(unfocusEditor());
					}}
					onBlur={() => {
						dispatch(focusEditor());
						window.ordo.emit("@file-explorer/hide-creation", null);
						setName("");
					}}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							window.ordo.emit(createFileIn ? "@file-explorer/create-file" : "@file-explorer/create-folder", name);
							setName("");
						} else if (e.key === "Escape") {
							dispatch(focusEditor());
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
