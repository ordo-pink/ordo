import React from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { Either } from "or-else";

import { useAppDispatch, useAppSelector } from "@core/state/store";
import { Header } from "@modules/file-explorer/components/header";
import { Creator } from "@modules/file-explorer/components/creator";
import { FolderContent } from "@modules/file-explorer/components/folder-content";
import { tapPreventDefault, tapStopPropagation } from "@utils/events";
import { FoldVoid } from "@utils/either";
import { NoOp } from "@utils/no-op";

import "@modules/file-explorer/index.css";

export const FileExplorer: React.FC = () => {
	const dispatch = useAppDispatch();

	const tree = useAppSelector((state) => state.fileExplorer.tree);

	const handleContextMenu = (e: React.MouseEvent) =>
		Either.of(e)
			.map(tapPreventDefault)
			.map(tapStopPropagation)
			.map(() =>
				dispatch({
					type: "@file-explorer/show-folder-context-menu",
					payload: { path: tree.path, x: e.clientX, y: e.clientY },
				}),
			)
			.fold(...FoldVoid);

	return Either.fromNullable(tree).fold(NoOp, (folder) => (
		<div className="file-explorer" onContextMenu={handleContextMenu}>
			<Header />
			<Creator path={folder.path} depth={0} />
			<div className="file-explorer_tree-wrapper">
				<Scrollbars autoHide>
					<FolderContent folder={folder} />
				</Scrollbars>
			</div>
		</div>
	));
};
