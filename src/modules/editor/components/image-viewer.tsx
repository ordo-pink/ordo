import React from "react";

import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";

export const ImageViewer: React.FC = () => {
	const { tab } = useCurrentTab();

	return (
		tab && (
			<div className="flex items-center justify-center p-24">
				<img className="shadow-2xl" src={tab.raw} />
			</div>
		)
	);
};
