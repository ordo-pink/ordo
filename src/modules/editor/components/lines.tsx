import React from "react";

import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";
import { Line } from "@modules/editor/components/line";

export const Lines = React.memo(
	() => {
		const { tab } = useCurrentTab();

		const handleKeyDown = React.useCallback(
			({ key, altKey, shiftKey, ctrlKey, metaKey }: KeyboardEvent) => {
				tab &&
					window.ordo.emit("@editor/handle-typing", {
						path: tab.path,
						event: { key, shiftKey, altKey, ctrlKey, metaKey } as KeyboardEvent,
					});
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

					window.ordo.emit("@editor/update-caret-positions", {
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
					});
				}}
			>
				{tab.lines && tab.lines.map((line, index) => <Line key={`${line}-${index}`} index={index} line={line} />)}
			</div>
		);
	},
	() => true,
);
