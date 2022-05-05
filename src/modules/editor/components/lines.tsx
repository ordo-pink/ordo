import React from "react";
import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";
import { useEditorDispatch, useEditorSelector, handleTyping, updateCaretPositions } from "@modules/editor/state";
import { Line } from "@modules/editor/components/line";

export const Lines = React.memo(
	() => {
		const dispatch = useEditorDispatch();
		const { tab } = useCurrentTab();
		const tabs = useEditorSelector((state) => state.editor.tabs);

		const handleKeyDown = ({ key, altKey, shiftKey, ctrlKey, metaKey }: KeyboardEvent) => {
			tab &&
				dispatch(handleTyping({ path: tab.path, event: { key, shiftKey, altKey, ctrlKey, metaKey } as KeyboardEvent }));
		};

		React.useEffect(() => {
			window.addEventListener("keydown", handleKeyDown);

			return () => {
				window.removeEventListener("keydown", handleKeyDown);
			};
		}, [tab]);

		if (!tab) return null;

		const currentTab = tabs.find((t) => t.path === tab.path);

		if (!currentTab || !currentTab.lines) return null;

		return (
			<div
				className="outline-none select-none cursor-text pb-[calc(50vh-9.5rem)]"
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();

					dispatch(
						updateCaretPositions({
							path: tab.path,
							positions: [
								{
									start: {
										line: currentTab.lines.length - 1,
										character: currentTab.lines[currentTab.lines.length - 1].length - 1,
									},
									end: {
										line: currentTab.lines.length - 1,
										character: currentTab.lines[currentTab.lines.length - 1].length - 1,
									},
									direction: "ltr",
								},
							],
						}),
					);
				}}
			>
				{currentTab.lines &&
					currentTab.lines.map((line, index) => <Line key={`${line}-${index}`} index={index} line={line} />)}
			</div>
		);
	},
	() => true,
);
