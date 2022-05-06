import React from "react";

import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";
import { Caret } from "@modules/editor/components/caret";

export const Char = React.memo(
	({ char, lineIndex, charIndex }: any): any => {
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

						window.ordo.emit("@editor/update-caret-positions", {
							path: tab.path,
							positions: [
								{
									start: { line: lineIndex, character: charIndex },
									end: { line: lineIndex, character: charIndex },
									direction: "ltr",
								},
							],
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
