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

		const current = useCurrentTab();

		const handleClick = (e: React.MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();

			if (!current.tab) return;

			if (e.altKey) {
				const found = current.tab.caretPositions.findIndex(
					(position) =>
						position.start.character === current.tab!.content.children[lineIndex].raw.length &&
						position.start.line === lineIndex + 1,
				);

				if (found !== -1) {
					const payload = current.tab!.caretPositions.slice(0, found).concat(current.tab.caretPositions.slice(found + 1));

					dispatch({
						type: "@editor/update-caret-positions",
						payload,
					});
				} else {
					dispatch({
						type: "@editor/update-caret-positions",
						payload: [
							...current.tab.caretPositions,
							{
								start: {
									line: lineIndex + 1,
									character: current.tab.content.children[lineIndex].raw.length,
								},
								end: {
									line: lineIndex + 1,
									character: current.tab.content.children[lineIndex].raw.length,
								},
								direction: "ltr",
							},
						],
					});
				}
			} else if (e.shiftKey) {
				if (lineIndex + 1 < current.tab.caretPositions[0].start.line) {
					dispatch({
						type: "@editor/update-caret-positions",
						payload: [
							{
								start: { line: lineIndex + 1, character: current.tab.content.children[lineIndex].raw.length },
								end: current.tab.caretPositions[0].end,
								direction: "rtl",
							},
						],
					});
				} else {
					dispatch({
						type: "@editor/update-caret-positions",
						payload: [
							{
								start: current.tab.caretPositions[0].start,
								end: { line: lineIndex + 1, character: current.tab.content.children[lineIndex].raw.length },
								direction: "ltr",
							},
						],
					});
				}
			} else {
				dispatch({
					type: "@editor/update-caret-positions",
					payload: [
						{
							start: {
								line: lineIndex + 1,
								character: current.tab.content.children[lineIndex].raw.length,
							},
							end: {
								line: lineIndex + 1,
								character: current.tab.content.children[lineIndex].raw.length,
							},
							direction: "ltr",
						},
					],
				});
			}
		};

		const line = current.tab && current.tab.content.children[lineIndex];
		const hasNoChildren = line && isNodeWithChildren(line) && !line.children.length;

		return Either.fromNullable(current.tab).fold(NoOp, (t) => (
			<div className="editor_line">
				<LineNumber number={lineIndex + 1} />
				<div className={`editor_line_content`} onClick={handleClick}>
					<Caret
						visible={t.caretPositions.some((position) =>
							position.direction === "rtl"
								? position.start.line === lineIndex + 1 && position.start.character === 0
								: position.end.line === lineIndex + 1 && position.end.character === 0,
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
