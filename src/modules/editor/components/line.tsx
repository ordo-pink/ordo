import React from "react";
import { Switch } from "or-else";

import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";
import { LineNumber } from "@modules/editor/components/line-number";
import { Char } from "@modules/editor/components/char";
import { useAppDispatch } from "@core/state/store";

export const Line = React.memo(
	({ index, line }: { index: number; line: string }) => {
		const dispatch = useAppDispatch();

		const { tab } = useCurrentTab();
		const [markup, setMarkup] = React.useState<any>({ type: "paragraph", children: [] });

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

		if (!tab) {
			return null;
		}

		const className = Switch.of(markup.type)
			.case("heading1", "font-bold text-4xl")
			.case("heading2", "font-bold text-3xl")
			.case("heading3", "font-bold text-2xl")
			.case("heading4", "font-bold text-xl")
			.case("heading5", "font-bold text-lg")
			.case("blockquote", "border-l-2 border-neutral-500 p-2 mx-2")
			.default("");

		return (
			<div className={`flex items-center align-middle w-full`}>
				<LineNumber number={index + 1} />
				<div
					className={`px-2 w-full whitespace-pre tracking-wide  ${className}`}
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
										start: { line: index, character: line.length - 1 },
										end: { line: index, character: line.length - 1 },
										direction: "ltr",
									},
								],
							},
						});
					}}
				>
					{markup.children.map((char: any, charIndex: number) => (
						<Char key={`${index}-${charIndex}`} lineIndex={index} charIndex={charIndex} char={char} />
					))}
				</div>
			</div>
		);
	},
	() => true,
);
