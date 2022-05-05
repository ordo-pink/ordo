import React from "react";
import Scrollbars from "react-custom-scrollbars-2";

import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";
import { Breadcrumbs } from "@modules/editor/components/breadcrumbs";
import { openTab, updateCaretPositions, useEditorDispatch, useEditorSelector } from "@modules/editor/state";
import { Lines } from "@modules/editor/components/lines";

export const TextEditor = React.memo(
	() => {
		const dispatch = useEditorDispatch();
		const { tab } = useCurrentTab();
		const tabs = useEditorSelector((state) => state.editor.tabs);

		React.useEffect(() => {
			if (tab) {
				dispatch(openTab(tab));
			}
		}, [tab]);

		if (!tab) return null;

		const currentTab = tabs.find((t) => t.path === tab.path);

		if (!currentTab || !currentTab.lines) return null;

		return (
			<div className="h-full">
				<Breadcrumbs />
				<div
					className="cursor-text h-full pb-6"
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
					<Scrollbars autoHide>
						<Lines />
					</Scrollbars>
				</div>
			</div>
		);
	},
	() => true,
);
