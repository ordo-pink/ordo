import React from "react";

import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";
import { Line } from "@modules/editor/components/line";
import { useAppDispatch, useAppSelector } from "@core/state/store";

export const Lines = React.memo(
	() => {
		const dispatch = useAppDispatch();

		const { tab } = useCurrentTab();
		const { focused } = useAppSelector((state) => state.editor);

		const handleKeyDown = React.useCallback(
			({ key, altKey, shiftKey, ctrlKey, metaKey }: KeyboardEvent) => {
				if (tab && focused) {
					dispatch({
						type: "@editor/handle-typing",
						payload: {
							path: tab.path,
							event: { key, shiftKey, altKey, ctrlKey, metaKey } as KeyboardEvent,
						},
					});
				}
			},
			[tab],
		);

		React.useEffect(() => {
			window.addEventListener("keydown", handleKeyDown);

			return () => {
				window.removeEventListener("keydown", handleKeyDown);
			};
		}, [tab]);

		if (!tab) {
			return null;
		}

		return (
			<div
				className="outline-none select-none cursor-text pb-[calc(50vh-9.5rem)]"
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();

					dispatch({
						type: "@editor/update-caret-positions",
						payload: {
							path: tab.path,
							positions: [
								{
									start: {
										line: tab.lines.length - 1,
										character: tab.lines[tab.lines.length - 1].length - 1,
									},
									end: {
										line: tab.lines.length - 1,
										character: tab.lines[tab.lines.length - 1].length - 1,
									},
									direction: "ltr",
								},
							],
						},
					});
				}}
			>
				{tab.lines && tab.lines.map((line, index) => <Line key={`${line}-${index}`} index={index} line={line} />)}
			</div>
		);
	},
	() => true,
);
