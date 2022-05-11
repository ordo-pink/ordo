import React from "react";
import { Either, Switch } from "or-else";

import { useAppDispatch } from "@core/state/store";
import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";
import { LineNumber } from "@modules/editor/components/line-number";
import { Char } from "@modules/editor/components/char";
import { tapPreventDefault, tapStopPropagation } from "@utils/events";
import { FoldVoid } from "@utils/either";
import { lastIndex } from "@utils/array";
import { NoOp } from "@utils/no-op";

export type LineProps = {
	lineIndex: number;
	line: string;
};

export const Line = React.memo(
	({ lineIndex, line }: LineProps) => {
		const dispatch = useAppDispatch();

		const { eitherTab } = useCurrentTab();

		const [markup, setMarkup] = React.useState<any>({ type: "paragraph", children: [] });
		const [className, setClassName] = React.useState<string>("");
		const [isCurrentLine, setIsCurrentLine] = React.useState<boolean>(true);
		const [path, setPath] = React.useState<string>("");

		React.useEffect(() => eitherTab.map((t) => setPath(t.path)).fold(...FoldVoid), [eitherTab]);

		React.useEffect(
			() => eitherTab.map((t) => setIsCurrentLine(t.caretPositions[0].start.line === lineIndex)).fold(...FoldVoid),
			[lineIndex, eitherTab],
		);

		React.useEffect(() => {
			setMarkup({
				type: Switch.of(line)
					.case(
						(x) => x.startsWith("# ") && x.length > 2,
						() => "heading1",
					)
					.case(
						(x) => x.startsWith("## ") && x.length > 3,
						() => "heading2",
					)
					.case(
						(x) => x.startsWith("### ") && x.length > 4,
						() => "heading3",
					)
					.case(
						(x) => x.startsWith("#### ") && x.length > 5,
						() => "heading4",
					)
					.case(
						(x) => x.startsWith("##### ") && x.length > 6,
						() => "heading5",
					)
					.case(
						(x) => x.startsWith("> ") && x.length > 2,
						() => "blockquote",
					)
					.default(() => "paragraph")(),
				children: line.split(""),
			});
		}, []);

		React.useEffect(() => {
			setClassName(
				Switch.of(markup.type)
					.case("heading1", "font-bold text-4xl")
					.case("heading2", "font-bold text-3xl")
					.case("heading3", "font-bold text-2xl")
					.case("heading4", "font-bold text-xl")
					.case("heading5", "font-bold text-lg")
					.case("blockquote", "border-l-2 border-neutral-500 p-2 mx-2")
					.default(""),
			);
		}, [markup.type]);

		const handleClick = (e: React.MouseEvent) =>
			Either.right(e)
				.map(tapPreventDefault)
				.map(tapStopPropagation)
				.chain(() => eitherTab)
				.map(() => lastIndex(line))
				.map((character) => ({ line: lineIndex, character }))
				.map((position) => [{ start: position, end: position, direction: "ltr" as const }])
				.map((positions) => ({ path, positions }))
				.map((payload) => dispatch({ type: "@editor/update-caret-positions", payload }))
				.fold(...FoldVoid);

		return eitherTab.fold(NoOp, () => (
			<div className="editor_line">
				<LineNumber number={lineIndex + 1} />
				<div className={`editor_line_content ${className}`} onClick={handleClick}>
					{markup.children.map((char: string, charIndex: number) => (
						<Char key={`${lineIndex}-${charIndex}`} lineIndex={lineIndex} charIndex={charIndex} char={char} />
					))}
				</div>
			</div>
		));
	},
	() => true,
);
