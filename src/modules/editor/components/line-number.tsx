import React from "react";
import { Either } from "or-else";

import { useAppDispatch } from "@core/state/store";
import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";
import { tapPreventDefault, tapStopPropagation } from "@utils/events";
import { FoldVoid } from "@utils/either";
import { NoOp } from "@utils/no-op";

type LineNumberProps = {
	number: number;
};

export const LineNumber = React.memo(
	({ number }: LineNumberProps) => {
		const dispatch = useAppDispatch();
		const { tab } = useCurrentTab();

		const handleClick = (e: React.MouseEvent) =>
			tab &&
			Either.right(e)
				.map(tapPreventDefault)
				.map(tapStopPropagation)
				.map(() => ({ line: number - 1, character: 0 }))
				.map((position) => [{ start: position, end: position, direction: "ltr" as const }])
				.map((positions) => ({ path: tab.path, positions }))
				.map((payload) => dispatch({ type: "@editor/update-caret-positions", payload }))
				.fold(...FoldVoid);

		return tab ? (
			<div contentEditable={false} className="editor_line_number" onClick={handleClick}>
				{number ?? "↑"}
			</div>
		) : null;
	},
	() => true,
);
