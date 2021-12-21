import React from "react";
import { useAppSelector } from "../redux/hooks";

export const ImageViewer: React.FC = () => {
	const currentTab = useAppSelector((state) => state.editor.currentTab);
	const tabs = useAppSelector((state) => state.editor.tabs);

	if (!tabs || currentTab == null || !tabs[currentTab] || tabs[currentTab].type !== "image") {
		return null;
	}

	return (
		<div className="flex items-center justify-center p-24">
			<img className="shadow-2xl" src={tabs[currentTab].body.join("")} />
		</div>
	);
};
