import React from "react";
import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";
import { useEditorDispatch, useEditorSelector, updateCaretPositions } from "@modules/editor/state";
import { Caret } from "@modules/editor/components/caret";

export const Char = React.memo(
	({ char, lineIndex, charIndex }: any): any => {
		const dispatch = useEditorDispatch();
		const { tab } = useCurrentTab();
		const tabs = useEditorSelector((state) => state.editor.tabs);

		if (!tab) return null;
		const currentTab = tabs.find((t) => t.path === tab.path);
		if (!currentTab) return null;

		return (
			<>
				{lineIndex === currentTab.caretPositions[0].start.line &&
				charIndex === currentTab.caretPositions[0].start.character ? (
					<Caret />
				) : null}
				<span
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();

						dispatch(
							updateCaretPositions({
								path: tab.path,
								positions: [
									{
										start: { line: lineIndex, character: charIndex },
										end: { line: lineIndex, character: charIndex },
										direction: "ltr",
									},
								],
							}),
						);
					}}
				>
					{char}
				</span>
			</>
		);
	},
	() => true,
);
