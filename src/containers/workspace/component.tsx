import React from "react";
import { useAppSelector } from "../../common/store-hooks";
import { components } from "../../components/components";

export const Workspace: React.FC = () => {
	const component = useAppSelector((state) => state.workspace.component);

	const Component = (components as unknown as Record<string, React.FC>)[component || "WelcomePage"];

	return <Component />;
};
