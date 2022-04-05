import { useAppDispatch, useAppSelector } from "@core/state/hooks";
import React from "react";

export const ImageViewer: React.FC = () => {
	const tabs = useAppSelector((state) => state.editor.tabs);
	const currentTab = useAppSelector((state) => state.editor.currentTab);
	const tab = tabs.find((t) => t.path === currentTab);

	if (!tab || !tab.raw) {
		return null;
	}

	return (
		<div className="flex items-center justify-center p-24">
			<img className="shadow-2xl" src={tab.raw} />
		</div>
	);
};
