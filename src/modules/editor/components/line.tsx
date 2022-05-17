import React from "react";
import { Either } from "or-else";

import { useAppDispatch } from "@core/state/store";
import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";
import { LineNumber } from "@modules/editor/components/line-number";
import { Token } from "@modules/editor/components/token";
import { tapPreventDefault, tapStopPropagation } from "@utils/events";
import { FoldVoid } from "@utils/either";
import { tail } from "@utils/array";
import { Caret } from "./caret";
import { tap } from "@utils/functions";

export type LineProps = {
	lineIndex: number;
};

export const Line = React.memo(
	({ lineIndex }: LineProps) => {
		const dispatch = useAppDispatch();

		const { tab } = useCurrentTab();

		const handleClick = (e: React.MouseEvent) =>
			tab &&
			Either.right(e)
				.map(tapPreventDefault)
				.map(tapStopPropagation)
				.chain(() => Either.fromNullable(tab))
				.map(tap((t) => console.log(t)))
				.map((t) => t.content)
				.map((p) => p.children[lineIndex])
				.map((l) => l.position.end)
				.map((position) => [{ start: position, end: position, direction: "ltr" as const }])
				.map((positions) => ({ path: tab.path, positions }))
				.map((payload) => dispatch({ type: "@editor/update-caret-positions", payload }))
				.fold(...FoldVoid);

		return tab ? (
			<div className="editor_line">
				<LineNumber number={lineIndex + 1} />
				<div className={`editor_line_content`} onClick={handleClick}>
					<Token token={tab.content.children[lineIndex]} lineIndex={lineIndex} />
				</div>
			</div>
		) : null;
	},
	() => true,
);
