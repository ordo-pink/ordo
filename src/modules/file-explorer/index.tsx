import React from "react";
import Scrollbars from "react-custom-scrollbars-2";

import { useAppSelector } from "@core/state/store";
import { Folder } from "@modules/file-explorer/components/folder";
import { Header } from "@modules/file-explorer/components/header";
import { isFolder } from "@modules/file-explorer/utils/is-folder";
import { File } from "@modules/file-explorer/components/file";
import { Creator } from "@modules/file-explorer/components/creator";

export const FileExplorer: React.FC = () => {
	const { tree } = useAppSelector((state) => state.fileExplorer);

	return (
		tree && (
			<>
				<div className="flex w-full items-center justify-between bg-neutral-300 dark:bg-neutral-800 py-1 px-2 rounded-tl-lg">
					<Header />
				</div>
				<Creator path={tree.path} depth={0} />
				{tree.collapsed ? null : (
					<div className="h-[calc(100vh-6.25rem)]">
						<Scrollbars autoHide={true}>
							<div className="mb-6">
								{tree.children.map((child) =>
									isFolder(child) ? <Folder folder={child} key={child.path} /> : <File file={child} key={child.path} />,
								)}
							</div>
						</Scrollbars>
					</div>
				)}
			</>
		)
	);
};
