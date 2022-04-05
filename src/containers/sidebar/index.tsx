import { useAppSelector } from "@core/state/hooks";
import { Folder } from "@modules/file-explorer/folder";
import { Switch } from "or-else";
import React from "react";
import Scrollbars from "react-custom-scrollbars";

export const Sidebar: React.FC = () => {
	const tree = useAppSelector((state) => state.fileExplorer.tree);
	return (
		<Scrollbars>
			<div className="flex flex-col py-3">{tree && <Folder folder={tree} />}</div>
		</Scrollbars>
	);
};
