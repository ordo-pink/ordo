import React from "react";

import { useAppDispatch, useAppSelector } from "@core/state/store";
import { useTreeNesting } from "@modules/file-explorer/hooks/use-tree-nesting";
import { fromBoolean } from "@utils/either";
import { NoOp } from "@utils/no-op";

type CreatorProps = {
	path: string;
	depth: number;
};

/**
 * Input field used for creating files or folders in any place within FileExplorer.
 * TODO: Extract logic and avoid rendering if file or folder creation is not required.
 */
export const Creator: React.FC<CreatorProps> = ({ path, depth }) => {
	const dispatch = useAppDispatch();

	const createFileIn = useAppSelector((state) => state.fileExplorer.createFileIn);
	const createFolderIn = useAppSelector((state) => state.fileExplorer.createFolderIn);

	const ref = React.useRef<HTMLInputElement>(null);

	const marginLeft = useTreeNesting(depth);

	const [name, setName] = React.useState<string>("");
	const [width, setWidth] = React.useState<string>();
	const [createHere, setCreateHere] = React.useState<boolean>(false);
	const [type, setType] = React.useState<"create-file" | "create-folder">("create-file");

	React.useEffect(() => {
		setWidth(`calc(100% - ${marginLeft})`);
	}, [marginLeft]);

	React.useEffect(() => {
		setCreateHere(createFileIn === path || createFolderIn === path);
		setType(createFileIn ? "create-file" : "create-folder");
	}, [createFileIn, createFolderIn, path]);

	const handleBlur = () => {
		dispatch({ type: "@editor/focus" });
		dispatch({ type: "@file-explorer/hide-creation" });
		setName("");
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value);
	const handleFocus = () => dispatch({ type: "@editor/unfocus" });
	const handleSubmit = () => {
		dispatch({ type: `@file-explorer/${type}`, payload: name });
		setName("");
	};
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			handleSubmit();
		} else if (e.key === "Escape") {
			ref.current?.blur();
		}
	};

	return fromBoolean(createHere).fold(NoOp, () => (
		<input
			type="text"
			className="file-explorer_creator"
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
	));
};
