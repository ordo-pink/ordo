import React from "react";

import { useAppSelector } from "@core/state/store";

export const Caret = React.memo(
	() => {
		const focused = useAppSelector((state) => state.editor.focused);
		const className = focused ? "caret" : "caret-unfocused";
		return <span className={className}></span>;
	},
	() => true,
);
