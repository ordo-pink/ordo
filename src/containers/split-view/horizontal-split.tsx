import React from "react";
import Split from "react-split";

import "@containers/split-view/index.css";

type HorizontalSplitProps = {
	sizes: [number, number];
	minSize?: number;
	snapOffset?: number;
	onDragEnd: (sizes: [number, number]) => void;
};

export const HorizontalSplit: React.FC<HorizontalSplitProps> = ({
	sizes,
	minSize = 0,
	snapOffset = 0,
	onDragEnd,
	children,
}) => {
	return (
		<Split
			className="split-view-horizontal"
			sizes={sizes}
			minSize={minSize}
			snapOffset={snapOffset}
			onDragEnd={onDragEnd}
		>
			{children}
		</Split>
	);
};
