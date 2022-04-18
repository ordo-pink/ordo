import { FileExplorer } from "@modules/file-explorer";
import React from "react";

export const Sidebar: React.FC = () => {
	return (
		<div className="flex flex-col">
			<FileExplorer />
		</div>
	);
};
