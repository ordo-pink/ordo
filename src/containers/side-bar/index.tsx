import React from "react";

import { FileExplorer } from "@modules/file-explorer";

export const Sidebar: React.FC = () => {
	return (
		<div className="flex flex-col shadow-xl rounded-tl-xl mt-2 bg-neutral-200  dark:bg-neutral-600">
			<FileExplorer />
		</div>
	);
};
