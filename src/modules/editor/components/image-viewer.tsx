import React from "react";

import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";
import { NoOp } from "@utils/no-op";

export const ImageViewer: React.FC = () => {
	const { tab } = useCurrentTab();

	return tab ? (
		<div className="editor_image-viewer">
			<img className="editor_image-viewer_image" src={tab.raw} />
		</div>
	) : null;
};
