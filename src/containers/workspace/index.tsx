import { useAppSelector } from "@core/state/hooks";
import { WelcomePage } from "@modules/welcome-page";
import { Switch } from "or-else";
import React from "react";

export const Workspace: React.FC = () => {
	const currentActivity = useAppSelector((state) => state.activityBar.current);

	const Component = Switch.of(currentActivity).default(WelcomePage);
	return (
		<div className="py-2 mt-12 h-[calc(100%-15.75rem)]">
			<Component />
		</div>
	);
};
