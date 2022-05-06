import { useAppDispatch } from "@core/state/store";
import React from "react";
import { useCurrentTab } from "../hooks/use-current-tab";

export const LineNumber = React.memo(
	({ number }: any) => {
		const dispatch = useAppDispatch();
		const { tab } = useCurrentTab();

		return tab ? (
			<div
				contentEditable={false}
				className="w-12 py-1 select-none self-stretch flex flex-shrink-0 justify-end border-r border-neutral-200 dark:border-neutral-600 text-right pr-2 font-mono text-neutral-500 dark:text-neutral-400 text-sm"
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();

					dispatch({ type: "@editor/focus" });
					dispatch({
						type: "@editor/update-caret-positions",
						payload: {
							path: tab?.path,
							positions: [
								{
									start: { line: number - 1, character: 0 },
									end: { line: number - 1, character: 0 },
									direction: "ltr",
								},
							],
						},
					});
				}}
			>
				{number ?? " "}
			</div>
		) : null;
	},
	() => true,
);
