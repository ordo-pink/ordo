import React from "react";
import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";
import { useEditorDispatch, useEditorSelector, updateCaretPositions } from "@modules/editor/state";
import { LineNumber } from "@modules/editor/components/line-number";
import { Char } from "@modules/editor/components/char";

export const Line = React.memo(
	({ index, line }: any) => {
		const dispatch = useEditorDispatch();
		const { tab } = useCurrentTab();
		const tabs = useEditorSelector((state) => state.editor.tabs);

		if (!tab) return null;
		const currentTab = tabs.find((t) => t.path === tab.path);
		if (!currentTab) return null;

		return (
			<div className="flex items-center w-full">
				<LineNumber number={index + 1} />
				<div
					className="px-2 w-full leading-5 whitespace-pre tracking-wide"
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();

						dispatch(
							updateCaretPositions({
								path: tab.path,
								positions: [
									{
										start: { line: index, character: line.length - 1 },
										end: { line: index, character: line.length - 1 },
										direction: "ltr",
									},
								],
							}),
						);
					}}
				>
					{line.split("").map((char: any, charIndex: number) => (
						<Char key={`${index}-${charIndex}`} lineIndex={index} charIndex={charIndex} char={char} />
					))}
				</div>
			</div>
		);
	},
	() => true,
);
