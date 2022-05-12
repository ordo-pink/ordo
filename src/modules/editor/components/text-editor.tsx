import React from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { Either } from "or-else";

import { useAppDispatch } from "@core/state/store";
import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";
import { Breadcrumbs } from "@modules/editor/components/breadcrumbs";
import { Lines } from "@modules/editor/components/lines";
import { tapPreventDefault, tapStopPropagation } from "@utils/events";
import { FoldVoid } from "@utils/either";
import { NoOp } from "@utils/no-op";
import { tap } from "@utils/functions";
import { lastIndex } from "@utils/array";

export const TextEditor: React.FC = () => {
	const dispatch = useAppDispatch();

	const [line, setLine] = React.useState<number>(0);
	const [character, setCharacter] = React.useState<number>(0);
	const [path, setPath] = React.useState<string>("");

	const { eitherTab } = useCurrentTab();

	React.useEffect(
		() =>
			eitherTab
				.map(tap((t) => setLine(lastIndex(t.lines))))
				.map(tap((t) => setCharacter(lastIndex(t.lines[lastIndex(t.lines)]))))
				.map(tap((t) => setPath(t.path)))
				.fold(...FoldVoid),
		[eitherTab],
	);

	const handleClick = (e: React.MouseEvent) =>
		Either.right(e)
			.map(tapPreventDefault)
			.map(tapStopPropagation)
			.map(() => dispatch({ type: "@editor/focus" }))
			.map(() => ({ line, character }))
			.map((position) => [{ start: position, end: position, direction: "ltr" as const }])
			.map((positions) => ({ path, positions }))
			.map((payload) => dispatch({ type: "@editor/update-caret-positions", payload }))
			.fold(...FoldVoid);

	return eitherTab.fold(NoOp, () => (
		<div className="h-full">
			<Breadcrumbs />
			<div className="editor_textarea" onClick={handleClick}>
				<Scrollbars autoHide>
					<Lines />
				</Scrollbars>
			</div>
		</div>
	));
};
