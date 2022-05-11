import React from "react";
import Split from "react-split";

import "@containers/split-view/index.css";

type VerticalSplitProps = {
	sizes: [number, number];
	minSize?: number;
	snapOffset?: number;
	onDragEnd: (sizes: [number, number]) => void;
};

/**
 * Splits the parent element vertically, providing a draggable SVG to control the height
 * of the items.
 */
export const VerticalSplit: React.FC<VerticalSplitProps> = ({
	sizes,
	minSize = 0,
	snapOffset = 0,
	onDragEnd,
	children,
}) => {
	return (
		<Split className="split-view-vertical" sizes={sizes} minSize={minSize} snapOffset={snapOffset} onDragEnd={onDragEnd}>
			{children}
		</Split>
	);
};
