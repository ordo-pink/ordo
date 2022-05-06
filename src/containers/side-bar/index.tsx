import React from "react";

import { FileExplorer } from "@modules/file-explorer";

export const Sidebar: React.FC = () => {
	return (
		<div className="flex flex-col">
			<FileExplorer />
		</div>
	);
};
