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

		const handleClick = (e: React.MouseEvent) =>
			tab &&
			Either.right(e)
				.map(tapPreventDefault)
				.map(tapStopPropagation)
				.chain(() => Either.fromNullable(tab))
				.map((t) => t.content)
				.map((t) => t.position.end)
				.map((position) => [{ start: position, end: position, direction: "ltr" as const }])
				.map((positions) => ({ path: tab.path, positions }))
				.map((payload) => dispatch({ type: "@editor/update-caret-positions", payload }))
				.fold(...FoldVoid);

		const removeKeyDownListener = () => window.removeEventListener("keydown", handleKeyDown);

		React.useEffect(() => {
			window.addEventListener("keydown", handleKeyDown);

			return () => removeKeyDownListener();
		}, [tab]);

		return tab ? (
			<div className="editor_lines" onClick={handleClick}>
				{tab.content.children.map((_, lineIndex) => (
					<Line key={`${lineIndex}`} lineIndex={lineIndex} />
				))}
			</div>
		) : null;
	},
	() => true,
);
