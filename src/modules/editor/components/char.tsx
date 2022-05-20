import React from "react";

import { useAppDispatch } from "@core/state/store";
import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";
import { Caret } from "@modules/editor/components/caret";
import { Char } from "@core/parser/types";

type CharProps = {
	char: Char;
};

export const Character = React.memo(
	({ char }: CharProps) => {
		const dispatch = useAppDispatch();
		const { tab } = useCurrentTab();

		const [isCaretHere, setIsCaretHere] = React.useState<boolean>(false);

		React.useEffect(() => {
			if (tab && tab.caretPositions) {
				setIsCaretHere(
					char.position.line === tab.caretPositions[0].start.line &&
						char.position.character === tab.caretPositions[0].start.character,
				);
			}
		}, [
			char.position.line,
			char.position.character,
			tab && tab.caretPositions && tab.caretPositions[0].start.line,
			tab && tab.caretPositions && tab.caretPositions[0].start.character,
		]);

		const handleClick = React.useCallback(
			(e: React.MouseEvent) => {
				e.preventDefault();
				e.stopPropagation();
				dispatch({
					type: "@editor/update-caret-positions",
					payload: {
						path: tab?.path || "",
						positions: [
							{
								start: {
									line: char.position.line,
									character: char.position.character,
								},
								end: {
									line: char.position.line,
									character: char.position.character,
								},
								direction: "ltr",
							},
						],
					},
				});
			},
			[char.position.line, char.position.character, tab?.path],
		);

		return (
			<>
				{char.value ? <span onClick={handleClick}>{char.value}</span> : null}
				<Caret visible={isCaretHere && char.position.character !== 0} />
			</>
		);
	},
	() => false,
);
