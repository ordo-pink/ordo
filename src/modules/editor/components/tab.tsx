import React from "react";
import { Either } from "or-else";

import { useIcon } from "@core/hooks/use-icon";
import { useAppDispatch, useAppSelector } from "@core/state/store";
import { findOrdoFile } from "@modules/file-explorer/utils/find-ordo-file";
import { useFileIcon } from "@modules/file-explorer/hooks/use-file-icon";
import { EditorTab } from "@modules/editor/types";
import { tapPreventDefault, tapStopPropagation } from "@utils/events";
import { FoldVoid, fromBoolean } from "@utils/either";
import { NoOp } from "@utils/no-op";

type TabProps = {
	tab: EditorTab;
};

export const Tab: React.FC<TabProps> = ({ tab }) => {
	const dispatch = useAppDispatch();

	const currentTab = useAppSelector((state) => state.editor.currentTab);
	const tree = useAppSelector((state) => state.fileExplorer.tree);
	const file = findOrdoFile(tree, "path", tab.path);

	const HiX = useIcon("HiX");
	const Icon = useFileIcon(file);
	const Unsaved = useIcon("HiExclamationCircle");

	const [path, setPath] = React.useState<string>("");
	const [isActive, setIsActive] = React.useState<boolean>(false);

	React.useEffect(
		() =>
			Either.fromNullable(file)
				.map((f) => setPath(f.path))
				.fold(...FoldVoid),
		[file],
	);

	React.useEffect(
		() =>
			Either.fromNullable(file)
				.map((f) => setIsActive(f.path === currentTab))
				.fold(...FoldVoid),
		[currentTab, file],
	);

	const handleClose = (e: React.MouseEvent) =>
		Either.right(e)
			.map(tapPreventDefault)
			.map(tapStopPropagation)
			.map(() => path)
			.map((payload) => dispatch({ type: "@editor/close-tab", payload }))
			.fold(...FoldVoid);

	const handleClick = (e: React.MouseEvent) =>
		Either.right(e)
			.map(tapPreventDefault)
			.map(tapStopPropagation)
			.map(() => path)
			.map((payload) => dispatch({ type: "@editor/open-tab", payload }))
			.fold(...FoldVoid);

	const handleMiddleButton = (e: React.MouseEvent) =>
		fromBoolean(e.button === 1)
			.map(() => handleClose(e))
			.fold(...FoldVoid);

	return Either.fromNullable(file)
		.chain((f) => Either.fromNullable(tab).map((t) => ({ f, t })))
		.fold(NoOp, ({ f, t }) => (
			<div
				title={t.path}
				tabIndex={1}
				key={t.path}
				className={`editor_tab ${isActive ? "editor_tab_active" : ""}`}
				onClick={handleClick}
				onMouseDown={handleMiddleButton}
			>
				<Icon className="editor_tab_file-icon" />
				<div>{f.readableName}</div>
				{t.unsaved ? <Unsaved className="text-orange-500" title="This file includes unsaved changes." /> : null}
				<HiX className="editor_tab_close-icon" onClick={handleClose} />
			</div>
		));
};
