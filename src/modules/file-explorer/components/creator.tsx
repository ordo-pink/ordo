import React from "react";

import { useAppDispatch, useAppSelector } from "@core/state/store";
import { useTreePadding } from "@modules/file-explorer/hooks/use-tree-padding";

import "@modules/file-explorer/components/creator.css";

type CreatorProps = {
	path: string;
	depth: number;
};

export const Creator: React.FC<CreatorProps> = ({ path, depth }) => {
	const dispatch = useAppDispatch();

	const { createFileIn, createFolderIn } = useAppSelector((state) => state.fileExplorer);

	const ref = React.useRef<HTMLInputElement>(null);

	const padding = useTreePadding(depth);

	const [name, setName] = React.useState("");
	const [createHere, setCreateHere] = React.useState<boolean>(false);
	const [type, setType] = React.useState<"@file-explorer/create-file" | "@file-explorer/create-folder">(
		"@file-explorer/create-file",
	);

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
	const handleSubmit = () => {
		dispatch({ type, payload: name });
		setName("");
	};
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			handleSubmit();
		} else if (e.key === "Escape") {
			ref.current?.blur();
		}
	};

	return createHere ? (
		<input
			type="text"
			className="creator"
			ref={ref}
			style={{ width: `calc(100% - ${padding})`, marginLeft: padding }}
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
