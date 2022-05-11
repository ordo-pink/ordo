import React from "react";
import { Either } from "or-else";

import { useAppDispatch } from "@core/state/store";
import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";
import { Caret } from "@modules/editor/components/caret";
import { tapPreventDefault, tapStopPropagation } from "@utils/events";
import { FoldVoid, fromBoolean } from "@utils/either";
import { NoOp } from "@utils/no-op";
import { tap } from "@utils/tap";

type CharProps = {
	char: string;
	lineIndex: number;
	charIndex: number;
};

export const Char = React.memo(
	({ char, lineIndex, charIndex }: CharProps) => {
		const dispatch = useAppDispatch();

		const { eitherTab } = useCurrentTab();

		const [isCaretHere, setIsCaretHere] = React.useState<boolean>(false);
		const [path, setPath] = React.useState<string>("");

		React.useEffect(() => eitherTab.map((t) => setPath(t.path)).fold(...FoldVoid), [eitherTab]);

		React.useEffect(
			() =>
				eitherTab
					.chain(({ caretPositions: [caret] }) =>
						fromBoolean(lineIndex === caret.start.line && charIndex === caret.start.character),
					)
					.fold(
						() => setIsCaretHere(false),
						() => setIsCaretHere(true),
					),
			[eitherTab, lineIndex, charIndex],
		);

		const handleClick = (e: React.MouseEvent) => {
			Either.right(e)
				.map(tapPreventDefault)
				.map(tapStopPropagation)
				.chain(() => eitherTab)
				.map(tap(() => dispatch({ type: "@editor/focus" })))
				.map(() => ({ line: lineIndex, character: charIndex }))
				.map((position) => [{ start: position, end: position, direction: "ltr" as const }])
				.map((positions) => ({ path, positions }))
				.map((payload) => dispatch({ type: "@editor/update-caret-positions", payload }))
				.fold(...FoldVoid);
		};

		return eitherTab.fold(NoOp, () => (
			<>
				{fromBoolean(isCaretHere).fold(NoOp, () => (
					<Caret />
				))}
				<span onClick={handleClick}>{char}</span>
			</>
		));
	},
	() => true,
);
