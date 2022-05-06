import React from "react";

import { useAppSelector } from "@core/state/store";
import { Tab } from "@modules/editor/components/tab";

export const Tabs: React.FC = () => {
	const tabs = useAppSelector((state) => state.editor.tabs);

	return (
		<div className="flex items-center p-2 flex-wrap select-none">
			{tabs && tabs.map((tab) => <Tab key={tab.path} tab={tab} />)}
		</div>
	);
};
