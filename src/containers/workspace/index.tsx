import React from "react";
import { Switch } from "or-else";

import { useAppSelector } from "@core/state/store";
import { Editor } from "@modules/editor";
import { WelcomePage } from "@modules/welcome-page";

export const Workspace: React.FC = () => {
	const currentActivity = useAppSelector((state) => state.activityBar.current);

	const Component = Switch.of(currentActivity).case("Editor", Editor).default(WelcomePage);
	return (
		<div className="py-2 h-[calc(100%-4.6rem)]">
			<Component />
		</div>
	);
};
