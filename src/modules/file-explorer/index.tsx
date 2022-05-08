import React from "react";
import Scrollbars from "react-custom-scrollbars-2";

import { useAppSelector } from "@core/state/store";
import { Folder } from "@modules/file-explorer/components/folder";
import { Header } from "@modules/file-explorer/components/header";
import { isFolder } from "@modules/file-explorer/utils/is-folder";
import { File } from "@modules/file-explorer/components/file";
import { Creator } from "@modules/file-explorer/components/creator";

import "@modules/file-explorer/index.css";

export const FileExplorer: React.FC = () => {
	const { tree } = useAppSelector((state) => state.fileExplorer);

	return tree ? (
		<>
			<div className="file-explorer">
				<Header />
			</div>
			<Creator path={tree.path} depth={0} />
			{!tree.collapsed ? (
				<div className="tree-wrapper">
					<Scrollbars autoHide={true}>
						{tree.children.map((child) =>
							isFolder(child) ? <Folder folder={child} key={child.path} /> : <File file={child} key={child.path} />,
						)}
					</Scrollbars>
				</div>
			) : null}
		</>
	) : null;
};
