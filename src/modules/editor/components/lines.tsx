import React from "react";
import { Either } from "or-else";

import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";
import { Line } from "@modules/editor/components/line";
import { useAppDispatch, useAppSelector } from "@core/state/store";
import { tap } from "@utils/tap";
import { FoldVoid, fromBoolean } from "@utils/either";
import { tapPreventDefault, tapStopPropagation } from "@utils/events";
import { NoOp } from "@utils/no-op";
import { lastIndex } from "@utils/array";

export const Lines = () => {
	const dispatch = useAppDispatch();

	const { eitherTab } = useCurrentTab();
	const { focused } = useAppSelector((state) => state.editor);

	const [line, setLine] = React.useState<number>(0);
	const [character, setCharacter] = React.useState<number>(0);
	const [path, setPath] = React.useState<string>("");

	React.useEffect(
		() =>
			eitherTab
				.map(tap((t) => setPath(t.path)))
				.map(tap((t) => setLine(lastIndex(t.lines))))
				.map(tap((t) => setCharacter(lastIndex(t.lines[lastIndex(t.lines)]))))
				.fold(...FoldVoid),
		[eitherTab],
	);

	const handleKeyDown = ({ key, altKey, shiftKey, ctrlKey, metaKey }: KeyboardEvent) =>
		eitherTab
			.map(() => ({ key, shiftKey, altKey, ctrlKey, metaKey }))
			.map((event) => ({ path, event }))
			.map((payload) => dispatch({ type: "@editor/handle-typing", payload }))
			.fold(...FoldVoid);

	const handleClick = (e: React.MouseEvent) =>
		Either.right(e)
			.map(tapPreventDefault)
			.map(tapStopPropagation)
			.chain(() => eitherTab)
			.map(tap(() => dispatch({ type: "@editor/focus" })))
			.map(() => ({ line, character }))
			.map((position) => [{ start: position, end: position, direction: "ltr" as const }])
			.map((positions) => ({ path, positions }))
			.map((payload) => dispatch({ type: "@editor/update-caret-positions", payload }))
			.fold(...FoldVoid);

	const removeKeyDownListener = () => window.removeEventListener("keydown", handleKeyDown);

	React.useEffect(() => {
		window.addEventListener("keydown", handleKeyDown);

		return () => removeKeyDownListener();
	}, [eitherTab]);

	return eitherTab.fold(NoOp, (t) => (
		<div className="editor_lines" onClick={handleClick}>
			{t.lines.map((line, lineIndex) => (
				<Line key={`${line}-${lineIndex}`} lineIndex={lineIndex} line={line} />
			))}
		</div>
	));
};
