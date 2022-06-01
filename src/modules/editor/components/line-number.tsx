import React from "react";
import { Either } from "or-else";

import { useAppDispatch, useAppSelector } from "@core/state/store";
import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";
import { tapPreventDefault, tapStopPropagation } from "@utils/events";
import { FoldVoid, fromBoolean } from "@utils/either";
import { NoOp, noOpFn } from "@utils/no-op";

type LineNumberProps = {
	number: number;
};

export const LineNumber = React.memo(
	({ number }: LineNumberProps) => {
		const dispatch = useAppDispatch();
		const showLineNumbers = useAppSelector((state) => state.app.userSettings.editor.showLineNumbers);
		const { tab } = useCurrentTab();

		const handleClick = (e: React.MouseEvent) =>
			Either.fromNullable(tab)
				.chain((t) =>
					Either.right(e)
						.map(tapPreventDefault)
						.map(tapStopPropagation)
						.map(() => ({ line: number, character: 0 }))
						.map((position) => [{ start: position, end: position, direction: "ltr" as const }]),
				)
				.fold(noOpFn, (payload) =>
					dispatch({
						type: "@editor/update-caret-positions",
						payload: {
							path: tab!.path,
							positions: tab!.caretPositions.concat(payload),
						},
					}),
				);

		return fromBoolean(showLineNumbers)
			.chain(() => Either.fromNullable(tab))
			.fold(NoOp, () => (
				<div contentEditable={false} className="editor_line_number" onClick={handleClick}>
					{number ?? "↑"}
				</div>
			));
	},
	() => true,
);
