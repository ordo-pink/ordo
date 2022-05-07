import React from "react";

import { useAppSelector } from "@core/state/store";
import { useWorkspaceComponent } from "@containers/workspace/hooks/use-workspace-component";

export const Workspace: React.FC = () => {
	const currentActivity = useAppSelector((state) => state.activityBar.current);

	const Component = useWorkspaceComponent(currentActivity);

	return (
		<div>
			<Component />
		</div>
	);
};
