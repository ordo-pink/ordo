import React from "react";
import { animated, SpringValue } from "react-spring";

export const ToggleHeading: React.FC<{
	opacity: SpringValue<number>;
	range: [number, number];
	output: [number, number];
}> = ({ opacity, range, output, children }) => (
	<animated.h1 className="welcome-page_title" style={{ position: "absolute", opacity: opacity.to({ range, output }) }}>
		{children}
	</animated.h1>
);
