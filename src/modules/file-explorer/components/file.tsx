import React from "react";

import { useAppDispatch, useAppSelector } from "@core/state/store";
import { OrdoFile } from "@modules/file-explorer/types";
import { useFileIcon } from "@modules/file-explorer/hooks/use-file-icon";

export const File: React.FC<{ file: OrdoFile }> = ({ file }) => {
	const dispatch = useAppDispatch();

	const selectedFile = useAppSelector((state) => state.editor.currentTab);
	const openFiles = useAppSelector((state) => state.editor.tabs);

	const Icon = useFileIcon(file);

	const [className, setClassName] = React.useState<string>("");

	React.useEffect(() => {
		setClassName(
			selectedFile === file.path
				? "bg-neutral-300 dark:bg-pink-700 border-neutral-500"
				: openFiles.some((f) => f.path === file.path)
				? "bg-neutral-300 dark:bg-neutral-700"
				: "",
		);
	}, [selectedFile, file, openFiles]);

	return (
		<div
			style={{ paddingLeft: (file.depth + 0.25) * 16 + 10 + "px" }}
			className={`flex space-x-2 cursor-pointer border border-transparent items-center select-none hover:bg-neutral-300 dark:hover:bg-neutral-700 ${className}`}
			onClick={() => dispatch({ type: "@editor/open-tab", payload: file.path })}
			onContextMenu={(e) =>
				dispatch({
					type: "@file-explorer/show-file-context-menu",
					payload: { path: file.path, x: e.clientX, y: e.clientY },
				})
			}
			draggable={true}
			onDragStart={(event: any) => {
				event.dataTransfer.setData("oldPath", file.path);
				event.dataTransfer.setData("fileName", file.readableName);
			}}
		>
			<Icon className="shrink-0 text-neutral-500" />
			<div className="pr-2 truncate">{file.readableName}</div>
		</div>
	);
};
