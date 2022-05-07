import React from "react";

import { FileExplorer } from "@modules/file-explorer";

import "@containers/side-bar/index.css";

export const Sidebar: React.FC = () => {
	return (
		<div className="sidebar">
			<FileExplorer />
		</div>
	);
};
