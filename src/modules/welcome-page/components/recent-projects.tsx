import React from "react";

import { useAppSelector } from "@core/state/store";
import { RecentProject } from "@modules/welcome-page/components/recent-project";

export const RecentProjects: React.FC = () => {
	const recentProjects = useAppSelector((state) => state.app.internalSettings.window?.recentProjects);

	return recentProjects && recentProjects.length > 0 ? (
		<div>
			<h2 className="welcome-page_actions-heading">Recent Projects</h2>
			{recentProjects.map((path) => (
				<RecentProject key={path} path={path} />
			))}
		</div>
	) : null;
};
