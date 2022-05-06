import React from "react";

import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";
import { Caret } from "@modules/editor/components/caret";
import { useAppDispatch } from "@core/state/store";

export const Char = React.memo(
	({ char, lineIndex, charIndex }: any): any => {
		const dispatch = useAppDispatch();

		const { tab } = useCurrentTab();

		if (!tab) {
			return;
		}

		return (
			<>
				{lineIndex === tab.caretPositions[0].start.line && charIndex === tab.caretPositions[0].start.character ? (
					<Caret />
				) : null}
				<span
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();

						dispatch({ type: "@editor/focus" });
						dispatch({
							type: "@editor/update-caret-positions",
							payload: {
								path: tab.path,
								positions: [
									{
										start: { line: lineIndex, character: charIndex },
										end: { line: lineIndex, character: charIndex },
										direction: "ltr",
									},
								],
							},
						});
					}}
				>
					{char}
				</span>
			</>
		);
	},
	() => true,
);
