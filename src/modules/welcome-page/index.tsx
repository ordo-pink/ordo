import React from "react";

import { Slogan } from "@modules/welcome-page/components/slogan";
import { Logo } from "@modules/welcome-page/components/logo";
import { RecentProjects } from "@modules/welcome-page/components/recent-projects";
import { Activities } from "@modules/welcome-page/components/activities";

import "@modules/welcome-page/index.css";

export const WelcomePage: React.FC = () => {
	return (
		<div className="welcome-page">
			<Slogan />
			<Logo />
			<div className="welcome-page_actions-container">
				<RecentProjects />
				<Activities />
			</div>
		</div>
	);
};
