import React from "react";

import { useAppSelector } from "@core/state/store";

export const Caret = React.memo(
	() => {
		const focused = useAppSelector((state) => state.editor.focused);
		const [className, setClassName] = React.useState<string>("caret");

		React.useEffect(() => {
			setClassName(focused ? "caret" : "caret-unfocused");
		}, [focused]);

		return <span className={className}></span>;
	},
	() => true,
);
