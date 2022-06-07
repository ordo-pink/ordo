import React from "react";

import { useAppDispatch, useAppSelector } from "@core/state/store";
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
		const alwaysShowMarkdownSymbols = useAppSelector((state) => state.app.userSettings.editor.alwaysShowMarkdownSymbols);

		const [isCaretHere, setIsCaretHere] = React.useState<boolean>(false);

		React.useEffect(() => {
			if (current.tab && current.tab.caretPositions) {
				setIsCaretHere(
					current.tab.caretPositions.some(
						(position) => char.position.line === position.start.line && char.position.character === position.start.character,
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
						const positions = current.tab.caretPositions.slice(0, found).concat(current.tab.caretPositions.slice(found + 1));

						dispatch({
							type: "@editor/update-caret-positions",
							payload: {
								path: current.tab.path,
								positions,
							},
						});
					} else {
						dispatch({
							type: "@editor/update-caret-positions",
							payload: {
								path: current.tab.path,
								positions: [
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
							},
						});
					}
				} else {
					dispatch({
						type: "@editor/update-caret-positions",
						payload: {
							path: current.tab?.path || "",
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
				{char.value ? <span onClick={handleClick}>{char.value}</span> : null}
				<Caret visible={isCaretHere && char.position.character !== 0} />
			</>
		);
	},
	(prev, next) => prev.char.value === next.char.value,
);
