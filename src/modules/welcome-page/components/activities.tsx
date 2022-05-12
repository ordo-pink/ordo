import React from "react";

import { useAppDispatch } from "@core/state/store";
import { useIcon } from "@core/hooks/use-icon";

export const Activities: React.FC = () => {
	const dispatch = useAppDispatch();

	const CogIcon = useIcon("HiOutlineCog");
	const OpenFolderIcon = useIcon("HiOutlineFolderOpen");

	const handleOpenFolderClick = () => {
		dispatch({ type: "@app/select-project" });
		dispatch({ type: "@side-bar/show" });
		dispatch({ type: "@activity-bar/open-editor" });
	};

	const handleSettingsClick = () => dispatch({ type: "@activity-bar/open-settings" });

	return (
		<div>
			<h2 className="welcome-page_actions-heading">Quick Actions</h2>
			<button className="welcome-page_action" onClick={handleOpenFolderClick}>
				<OpenFolderIcon />
				<span>Open Folder</span>
			</button>
			<button className="welcome-page_action" onClick={handleSettingsClick}>
				<CogIcon />
				<span>Settings</span>
			</button>
		</div>
	);
};
