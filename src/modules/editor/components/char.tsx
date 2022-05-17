import React from "react";

import { MdSymbol } from "@modules/md-parser/types";
import { useAppDispatch } from "@core/state/store";
import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";
import { Caret } from "@modules/editor/components/caret";

type CharProps = {
	char: MdSymbol;
};

export const Char = React.memo(
	({ char }: CharProps) => {
		const dispatch = useAppDispatch();
		const { tab } = useCurrentTab();

		const [isCaretHere, setIsCaretHere] = React.useState<boolean>(false);

		React.useEffect(() => {
			if (tab && tab.caretPositions) {
				setIsCaretHere(
					char.position.start.line === tab.caretPositions[0].start.line &&
						char.position.start.character === tab.caretPositions[0].start.character,
				);
			}
		}, [
			char.position.start.line,
			char.position.start.character,
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
									line: char.position.start.line,
									character: char.position.start.character,
								},
								end: {
									line: char.position.start.line,
									character: char.position.start.character,
								},
								direction: "ltr",
							},
						],
					},
				});
			},
			[char.position.start.line, char.position.start.character, tab?.path],
		);

		return (
			<>
				<span onClick={handleClick}>{char.value}</span>
				<Caret visible={isCaretHere} />
			</>
		);
	},
	() => true,
);
