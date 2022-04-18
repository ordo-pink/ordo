// import { Editor } from "@modules/editor";
import { useAppSelector } from "@core/state/store";
import { WelcomePage } from "@modules/welcome-page";
import { Switch } from "or-else";
import React from "react";

export const Workspace: React.FC = () => {
	const currentActivity = useAppSelector((state) => state.activityBar.current);

	const Component = Switch.of(currentActivity).default(WelcomePage);
	return (
		<div className="py-2 h-[calc(100%-4.6rem)]">
			<Component />
		</div>
	);
};
