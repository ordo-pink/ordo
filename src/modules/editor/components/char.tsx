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
		const { tab } = useCurrentTab();
		const alwaysShowMarkdownSymbols = useAppSelector((state) => state.app.userSettings.editor.alwaysShowMarkdownSymbols);

		const [isCaretHere, setIsCaretHere] = React.useState<boolean>(false);

		React.useEffect(() => {
			if (tab && tab.caretPositions) {
				setIsCaretHere(
					tab.caretPositions.some(
						(position) => char.position.line === position.start.line && char.position.character === position.start.character,
					),
				);
			}
		}, [
			char.position.line,
			char.position.character,
			tab,
			tab && tab.caretPositions.length,
			tab && tab.caretPositions[0].start.line,
			tab && tab.caretPositions[0].start.character,
		]);

		const handleClick = React.useCallback(
			(e: React.MouseEvent) => {
				e.preventDefault();
				e.stopPropagation();

				if (!tab) return;

				if (e.altKey) {
					const found = tab.caretPositions.findIndex(
						(position) => position.start.character === char.position.character && position.start.line === char.position.line,
					);

					if (found !== -1) {
						const positions = tab.caretPositions.slice(0, found).concat(tab.caretPositions.slice(found + 1));

						dispatch({
							type: "@editor/update-caret-positions",
							payload: {
								path: tab.path,
								positions,
							},
						});
					} else {
						dispatch({
							type: "@editor/update-caret-positions",
							payload: {
								path: tab.path,
								positions: [
									...tab.caretPositions,
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
				}
			},
			[
				char.position.line,
				char.position.character,
				tab,
				tab && tab.caretPositions.length,
				tab && tab.caretPositions[0].start.line,
				tab && tab.caretPositions[0].start.character,
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
