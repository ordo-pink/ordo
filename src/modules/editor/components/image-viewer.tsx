import React from "react";
import { Either } from "or-else";

import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";
import { NoOp } from "@utils/no-op";

export const ImageViewer: React.FC = () => {
	const { eitherTab } = useCurrentTab();

	return eitherTab.fold(NoOp, (t) => (
		<div className="editor_image-viewer">
			<img className="editor_image-viewer_image" src={t.raw} />
		</div>
	));
};
