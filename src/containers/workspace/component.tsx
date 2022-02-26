import React from "react";

import { useAppSelector } from "@core/store-hooks";
import { components } from "@modules/components";

export const Workspace: React.FC = () => {
	const component = useAppSelector((state) => state.workspace.component);

	const Component = (components as unknown as Record<string, React.FC>)[component || "WelcomePage"];

	return <Component />;
};
