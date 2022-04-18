import { FileExplorer } from "@modules/file-explorer";
import React from "react";
import Scrollbars from "react-custom-scrollbars";

export const Sidebar: React.FC = () => {
	return (
		<div className="flex flex-col">
			<FileExplorer />
		</div>
	);
};
