import React from "react";
import { Either } from "or-else";

import { useAppDispatch, useAppSelector } from "@core/state/store";
import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";
import { Line } from "@modules/editor/components/line";
import { tapPreventDefault, tapStopPropagation } from "@utils/events";
import { FoldVoid } from "@utils/either";
import { lastIndex } from "@utils/array";
import { tap } from "@utils/functions";
import { NoOp } from "@utils/no-op";

export const Lines = React.memo(
	() => {
		const dispatch = useAppDispatch();

		const { tab } = useCurrentTab();
		const { focused } = useAppSelector((state) => state.editor);

		const [line, setLine] = React.useState<number>(0);
		const [character, setCharacter] = React.useState<number>(0);
		const [path, setPath] = React.useState<string>("");

		const handleKeyDown = (e: KeyboardEvent) => {
			if (!tab) return;

			const { key, shiftKey, altKey, ctrlKey, metaKey } = e;
			e.preventDefault();
			e.stopPropagation();
			dispatch({
				type: "@editor/handle-typing",
				payload: {
					path: tab?.path,
					event: { key, shiftKey, altKey, ctrlKey, metaKey },
				},
			});
		};

		// const handleClick = (e: React.MouseEvent) =>
		// 	Either.right(e)
		// 		.map(tapPreventDefault)
		// 		.map(tapStopPropagation)
		// 		.chain(() => eitherTab)
		// 		.map(tap(() => dispatch({ type: "@editor/focus" })))
		// 		.map(() => ({ line, character }))
		// 		.map((position) => [{ start: position, end: position, direction: "ltr" as const }])
		// 		.map((positions) => ({ path, positions }))
		// 		.map((payload) => dispatch({ type: "@editor/update-caret-positions", payload }))
		// 		.fold(...FoldVoid);

		const removeKeyDownListener = () => window.removeEventListener("keydown", handleKeyDown);

		React.useEffect(() => {
			window.addEventListener("keydown", handleKeyDown);

			return () => removeKeyDownListener();
		}, [tab]);

		return tab ? (
			<div className="editor_lines">
				{tab.parsed.children.map((_, lineIndex) => (
					<Line key={`${lineIndex}`} lineIndex={lineIndex} />
				))}
			</div>
		) : null;
	},
	() => true,
);
