import React from "react";
import { useEditorSelector } from "@modules/editor/state";

export const Caret = React.memo(
	() => {
		const focused = useEditorSelector((state) => state.editor.focused);
		const className = focused ? "caret" : "caret-unfocused";
		return <span className={className}></span>;
	},
	() => true,
);
