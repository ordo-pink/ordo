import React from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { Either } from "or-else";

import { useAppSelector } from "@core/state/store";
import { Header } from "@modules/file-explorer/components/header";
import { Creator } from "@modules/file-explorer/components/creator";
import { FolderContent } from "@modules/file-explorer/components/folder-content";
import { NoOp } from "@utils/no-op";

import "@modules/file-explorer/index.css";

export const FileExplorer: React.FC = () => {
	const tree = useAppSelector((state) => state.fileExplorer.tree);

	return Either.fromNullable(tree).fold(NoOp, (folder) => (
		<div className="file-explorer">
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
