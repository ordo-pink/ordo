import React from "react";
import * as HiIcons from "react-icons/hi";
import { IconType } from "react-icons/lib";

/**
 * An easy to use hook for importing an SVG icon into a component. Internally it uses
 * Hero Icons package from `react-icons` (distributed via MIT license).
 */
export const useIcon = (name?: keyof typeof HiIcons): IconType => {
	const Icon = React.useMemo(
		() => (name ? (HiIcons as Record<keyof typeof HiIcons, IconType>)[name] : ((() => null) as unknown as IconType)),
		[name],
	);

	return Icon;
};
