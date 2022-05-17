import React from "react";

import { useAppSelector } from "@core/state/store";
import { fromBoolean } from "@utils/either";

type CaretProps = {
	visible?: boolean;
};

export const Caret = React.memo(
	({ visible = false }: CaretProps) => {
		const focused = useAppSelector((state) => state.editor.focused);

		return (
			<span className={`editor_caret ${focused ? "" : "editor_caret_unfocused"} ${visible ? "inline" : "hidden"}`}></span>
		);
	},
	(prev, next) => prev.visible === next.visible,
);
