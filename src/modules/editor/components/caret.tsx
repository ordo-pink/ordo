import React from "react";

import { useAppSelector } from "@core/state/store";
import { fromBoolean } from "@utils/either";

export const Caret = () => {
	const focused = useAppSelector((state) => state.editor.focused);

	const [unfocused, setUnfocused] = React.useState<string>("");

	React.useEffect(
		() =>
			fromBoolean(focused).fold(
				() => setUnfocused("editor_caret_unfocused"),
				() => setUnfocused(""),
			),
		[focused],
	);

	return <span className={`editor_caret ${unfocused}`}></span>;
};
