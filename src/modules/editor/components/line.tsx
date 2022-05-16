import React from "react";
import { Either } from "or-else";

import { useAppDispatch } from "@core/state/store";
import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";
import { LineNumber } from "@modules/editor/components/line-number";
import { Token } from "@modules/editor/components/token";
import { useLine } from "@modules/editor/hooks/use-line";
import { tapPreventDefault, tapStopPropagation } from "@utils/events";
import { FoldVoid } from "@utils/either";
import { tail } from "@utils/array";
import { NoOp } from "@utils/no-op";

export type LineProps = {
	lineIndex: number;
};

export const Line = ({ lineIndex }: LineProps) => {
	const dispatch = useAppDispatch();

	const { eitherTab } = useCurrentTab();
	const eitherLine = useLine(lineIndex);

	const [path, setPath] = React.useState<string>("");

	React.useEffect(() => eitherTab.map((t) => setPath(t.path)).fold(...FoldVoid), [eitherTab]);

	const handleClick = (e: React.MouseEvent) =>
		Either.right(e)
			.map(tapPreventDefault)
			.map(tapStopPropagation)
			.chain(() => eitherTab)
			.map((t) => t.parsed)
			.map((p) => tail(p.children))
			.map((l) => l.position)
			.map((position) => ({ line: position.start.line, character: position.start.character }))
			.map((position) => [{ start: position, end: position, direction: "ltr" as const }])
			.map((positions) => ({ path, positions }))
			.map((payload) => dispatch({ type: "@editor/update-caret-positions", payload }))
			.fold(...FoldVoid);

	return eitherLine.fold(NoOp, (l) => (
		<div className="editor_line">
			<LineNumber number={lineIndex + 1} />
			<div className={`editor_line_content`} onClick={handleClick}>
				<Token token={l} />
			</div>
		</div>
	));
};
