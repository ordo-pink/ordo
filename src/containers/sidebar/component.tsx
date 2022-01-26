import React from "react";
import { components } from "../../components/components";
import { useAppSelector } from "../../common/store-hooks";

export const Sidebar: React.FC = () => {
	const component = useAppSelector((state) => state.sidebar.component);

	if (!component) {
		return null;
	}

	const Component = (components as unknown as Record<string, React.FC>)[component];

	if (!Component) {
		window.ordo.emit("@sidebar/hide");
		return null;
	}

	return <Component />;
};
