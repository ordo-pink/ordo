import React from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { Either } from "or-else";

import { useAppDispatch } from "@core/state/store";
import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";
import { Breadcrumbs } from "@modules/editor/components/breadcrumbs";
import { Lines } from "@modules/editor/components/lines";
import { tapPreventDefault, tapStopPropagation } from "@utils/events";
import { FoldVoid } from "@utils/either";

export const TextEditor: React.FC = React.memo(
	() => {
		const dispatch = useAppDispatch();

		const { tab } = useCurrentTab();

		const handleClick = (e: React.MouseEvent) =>
			tab &&
			Either.right(e)
				.map(tapPreventDefault)
				.map(tapStopPropagation)
				.map(() => dispatch({ type: "@editor/focus" }))
				.map(() => ({
					line: tab.parsed.children[tab.parsed.children.length - 1].position.end.line,
					character: tab.parsed.children[tab.parsed.children.length - 1].position.end.character,
				}))
				.map((position) => [{ start: position, end: position, direction: "ltr" as const }])
				.map((positions) => ({ path: tab.path, positions }))
				.map((payload) => dispatch({ type: "@editor/update-caret-positions", payload }))
				.fold(...FoldVoid);

		return tab ? (
			<div className="h-full">
				<Breadcrumbs />
				<div className="editor_textarea" onClick={handleClick}>
					<Scrollbars autoHide>
						<Lines />
					</Scrollbars>
				</div>
			</div>
		) : null;
	},
	() => true,
);
