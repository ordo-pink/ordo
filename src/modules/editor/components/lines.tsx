import React from "react";
import { Either } from "or-else";

import { useAppDispatch, useAppSelector } from "@core/state/store";
import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";
import { Line } from "@modules/editor/components/line";
import { tapPreventDefault, tapStopPropagation } from "@utils/events";
import { FoldVoid } from "@utils/either";
import { tail } from "@utils/array";

export const Lines = React.memo(
	() => {
		const dispatch = useAppDispatch();

		const current = useCurrentTab();
		const focused = useAppSelector((state) => state.editor.focused);

		const handleKeyDown = (e: KeyboardEvent) => {
			if (!current.tab || !focused || e.key === "Control" || e.altKey || e.metaKey) {
				return;
			}

			console.log(e.key);

			const { key, shiftKey, altKey, ctrlKey, metaKey } = e;

			if (key === "Tab" && focused) {
				dispatch({ type: "@editor/unfocus" });
				return;
			}

			e.preventDefault();
			e.stopPropagation();

			dispatch({
				type: "@editor/handle-typing",
				payload: {
					path: current.tab?.path,
					event: { key, shiftKey, altKey, ctrlKey, metaKey },
				},
			});
		};

		const handleClick = (e: React.MouseEvent) =>
			Either.fromNullable(current.tab)
				.chain((t) =>
					Either.right(e)
						.map(tapPreventDefault)
						.map(tapStopPropagation)
						.map(() => t.content)
						.chain((c) => Either.fromNullable(tail(c.children).range.end))
						.map((position) => [{ start: position, end: position, direction: "ltr" as const }])
						.map((payload) => dispatch({ type: "@editor/update-caret-positions", payload })),
				)
				.fold(...FoldVoid);

		const removeKeyDownListener = () => window.removeEventListener("keydown", handleKeyDown);

		React.useEffect(() => {
			if (current.tab && focused) {
				window.addEventListener("keydown", handleKeyDown);
			}

			return () => removeKeyDownListener();
		}, [current.tab, focused]);

		return current.tab ? (
			<div className="h-[calc(100vh-9rem)] overflow-auto" onClick={handleClick}>
				{current.tab.content.children.map((_, lineIndex) => (
					<Line key={`${lineIndex}`} lineIndex={lineIndex} />
				))}
			</div>
		) : null;
	},
	() => true,
);
