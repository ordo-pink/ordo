import React from "react";

import { Slogan } from "@modules/welcome-page/components/slogan";
import { Logo } from "@modules/welcome-page/components/logo";
import { RecentProjects } from "@modules/welcome-page/components/recent-projects";
import { Activities } from "@modules/welcome-page/components/activities";

import "@modules/welcome-page/index.css";

/**
 * WelcomePage is displayed when the user has no project opened. It is the
 * entry point of the application. It provides access to quick actions like
 * opening recent projects, selecting a folder as a new project, or editing
 * user preferences.
 */
export const WelcomePage: React.FC = () => {
	return (
		<div className="welcome-page">
			<Logo />
			<Slogan />
			<div className="welcome-page_actions-container">
				<RecentProjects />
				<Activities />
			</div>
		</div>
	);
};
