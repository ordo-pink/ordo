import React from "react";

import { useAppDispatch, useAppSelector } from "@core/state/store";

import "@modules/file-explorer/components/creator.css";

export const Creator: React.FC<{ path: string; depth: number }> = ({ path, depth }) => {
	const dispatch = useAppDispatch();

	const { createFileIn, createFolderIn } = useAppSelector((state) => state.fileExplorer);

	const ref = React.useRef<HTMLInputElement>(null);

	const [name, setName] = React.useState("");
	const [createHere, setCreateHere] = React.useState<boolean>(false);
	const [width, setWidth] = React.useState<string>("");
	const [marginLeft, setMarginLeft] = React.useState<string>("");
	const [type, setType] = React.useState<"@file-explorer/create-file" | "@file-explorer/create-folder">(
		"@file-explorer/create-file",
	);

	React.useEffect(() => {
		setWidth(`calc(100% - ${depth ? depth * 16 + 16 + "px" : "0px"})`);
		setMarginLeft(depth ? depth * 16 + 16 + "px" : "0px");
	}, [depth]);

	React.useEffect(() => {
		setCreateHere(createFileIn === path || createFolderIn === path);
		setType(createFileIn ? "@file-explorer/create-file" : "@file-explorer/create-folder");
	}, [createFileIn, createFolderIn, path]);

	const handleBlur = () => {
		dispatch({ type: "@editor/focus" });
		dispatch({ type: "@file-explorer/hide-creation" });
		setName("");
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value);
	const handleFocus = () => dispatch({ type: "@editor/unfocus" });
	const handleSubmit = React.useCallback(() => {
		dispatch({ type, payload: name });
		setName("");
	}, [type, name]);
	const handleKeyDown = React.useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (e.key === "Enter") {
				handleSubmit();
			} else if (e.key === "Escape") {
				ref.current?.blur();
			}
		},
		[ref.current],
	);

	return createHere ? (
		<input
			type="text"
			className="creator"
			ref={ref}
			style={{ width, marginLeft }}
			autoFocus={createHere}
			value={name}
			onChange={handleChange}
			onFocus={handleFocus}
			onBlur={handleBlur}
			onKeyDown={handleKeyDown}
			onSubmit={handleSubmit}
		/>
	) : null;
};
