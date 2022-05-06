import React from "react";
import Scrollbars from "react-custom-scrollbars-2";

import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";
import { Breadcrumbs } from "@modules/editor/components/breadcrumbs";
import { Lines } from "@modules/editor/components/lines";
import { useAppDispatch } from "@core/state/store";

export const TextEditor = React.memo(
	() => {
		const dispatch = useAppDispatch();

		const { tab } = useCurrentTab();

		if (!tab) return null;

		return (
			<div className="h-full">
				<Breadcrumbs />
				<div
					className="cursor-text h-full pb-6"
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
					<Scrollbars autoHide>
						<Lines />
					</Scrollbars>
				</div>
			</div>
		);
	},
	() => true,
);
