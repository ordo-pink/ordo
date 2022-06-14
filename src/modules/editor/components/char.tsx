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
		const current = useCurrentTab();

		const [isCaretHere, setIsCaretHere] = React.useState<boolean>(false);
		const [isWithinSelection, setIsWithinSelection] = React.useState<boolean>(false);

		React.useEffect(() => {
			if (current.tab && current.tab.caretPositions) {
				setIsCaretHere(
					current.tab.caretPositions.some(
						(position) =>
							char.position.line === (position.direction === "rtl" ? position.start.line : position.end.line) &&
							char.position.character === (position.direction === "rtl" ? position.start.character : position.end.character),
					),
				);

				setIsWithinSelection(
					current.tab.caretPositions.some(
						(position) =>
							(position.start.character !== position.end.character || position.start.line !== position.end.line) &&
							((char.position.line === position.start.line &&
								char.position.line === position.end.line &&
								char.position.character > position.start.character &&
								char.position.character <= position.end.character) ||
								(char.position.line > position.start.line && char.position.line < position.end.line) ||
								(char.position.line === position.start.line &&
									char.position.line < position.end.line &&
									char.position.character > position.start.character) ||
								(char.position.line > position.start.line &&
									char.position.line === position.end.line &&
									char.position.character <= position.end.character)),
					),
				);
			}
		}, [
			char.position.line,
			char.position.character,
			current.tab,
			current.tab && current.tab.caretPositions.length,
			current.tab && current.tab.caretPositions[0].start.line,
			current.tab && current.tab.caretPositions[0].start.character,
		]);

		const handleClick = React.useCallback(
			(e: React.MouseEvent) => {
				if (e.ctrlKey) return;

				e.preventDefault();
				e.stopPropagation();

				if (!current.tab) return;

				if (e.altKey) {
					const found = current.tab.caretPositions.findIndex(
						(position) => position.start.character === char.position.character && position.start.line === char.position.line,
					);

					if (found !== -1) {
						const payload = current.tab.caretPositions.slice(0, found).concat(current.tab.caretPositions.slice(found + 1));

						dispatch({
							type: "@editor/update-caret-positions",
							payload,
						});
					} else {
						dispatch({
							type: "@editor/update-caret-positions",
							payload: [
								...current.tab.caretPositions,
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
						});
					}
				} else {
					dispatch({
						type: "@editor/update-caret-positions",
						payload: [
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
					});
				}
			},
			[
				char.position.line,
				char.position.character,
				current.tab,
				current.tab && current.tab.caretPositions.length,
				current.tab && current.tab.caretPositions[0].start.line,
				current.tab && current.tab.caretPositions[0].start.character,
			],
		);

		return (
			<>
				{char.value ? (
					<span className={isWithinSelection ? "bg-pink-200" : ""} onClick={handleClick}>
						{char.value}
					</span>
				) : null}
				<Caret visible={isCaretHere && char.position.character !== 0} />
			</>
		);
	},
	(prev, next) => prev.char.value === next.char.value,
);
