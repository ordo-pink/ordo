import React from "react";
import { Either } from "or-else";

import { useAppDispatch } from "@core/state/store";
import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";
import { LineNumber } from "@modules/editor/components/line-number";
import { Token } from "@modules/editor/components/token";
import { Caret } from "@modules/editor/components/caret";
import { isNodeWithChildren } from "@core/parser/is";
import { NoOp } from "@utils/no-op";

export type LineProps = {
	lineIndex: number;
};

export const Line = React.memo(
	({ lineIndex }: LineProps) => {
		const dispatch = useAppDispatch();

		const { tab } = useCurrentTab();

		const handleClick = (e: React.MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();

			if (!tab) return;

			if (e.altKey) {
				const found = tab.caretPositions.findIndex(
					(position) =>
						position.start.character === tab.content.children[lineIndex].raw.length && position.start.line === lineIndex + 1,
				);

				if (found !== -1) {
					const positions = tab.caretPositions.slice(0, found).concat(tab.caretPositions.slice(found + 1));

					dispatch({
						type: "@editor/update-caret-positions",
						payload: {
							path: tab.path,
							positions,
						},
					});
				} else {
					dispatch({
						type: "@editor/update-caret-positions",
						payload: {
							path: tab.path,
							positions: [
								...tab.caretPositions,
								{
									start: {
										line: lineIndex + 1,
										character: tab.content.children[lineIndex].raw.length,
									},
									end: {
										line: lineIndex + 1,
										character: tab.content.children[lineIndex].raw.length,
									},
									direction: "ltr",
								},
							],
						},
					});
				}
			} else {
				dispatch({
					type: "@editor/update-caret-positions",
					payload: {
						path: tab.path,
						positions: [
							{
								start: {
									line: lineIndex + 1,
									character: tab.content.children[lineIndex].raw.length,
								},
								end: {
									line: lineIndex + 1,
									character: tab.content.children[lineIndex].raw.length,
								},
								direction: "ltr",
							},
						],
					},
				});
			}
		};

		const line = tab && tab.content.children[lineIndex];
		const hasNoChildren = line && isNodeWithChildren(line) && !line.children.length;

		return Either.fromNullable(tab).fold(NoOp, (t) => (
			<div className="editor_line">
				<LineNumber number={lineIndex + 1} />
				<div className={`editor_line_content`} onClick={handleClick}>
					<Caret
						visible={t.caretPositions.some(
							(position) => position.start.line === lineIndex + 1 && position.start.character === 0,
						)}
					/>
					{hasNoChildren && <span> </span>}
					<Token token={t.content.children[lineIndex]} lineIndex={lineIndex} />
				</div>
			</div>
		));
	},
	() => true,
);
