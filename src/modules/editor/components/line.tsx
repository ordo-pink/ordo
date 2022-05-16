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
import { useLine } from "../hooks/use-line";
import { Token, TokenWithChildren } from "@modules/md-parser/types";
import { useToken } from "../hooks/use-token";
import { tap } from "@utils/functions";
import { BlockTokenType, InlineTokenType } from "@modules/md-parser/enums";

export type LineProps = {
	lineIndex: number;
};

export const Line = React.memo(
	({ lineIndex }: LineProps) => {
		const dispatch = useAppDispatch();

		const eitherLine = useLine(lineIndex);

		const [className, setClassName] = React.useState<string>("");
		const [isCurrentLine, setIsCurrentLine] = React.useState<boolean>(true);
		// const [path, setPath] = React.useState<string>("");

		// React.useEffect(() => eitherTab.map((t) => setPath(t.path)).fold(...FoldVoid), [eitherTab]);

		// React.useEffect(
		// 	() => eitherTab.map((t) => setIsCurrentLine(t.caretPositions[0].start.line === lineIndex)).fold(...FoldVoid),
		// 	[lineIndex, eitherTab],
		// );

		// const handleClick = (e: React.MouseEvent) =>
		// 	Either.right(e)
		// 		.map(tapPreventDefault)
		// 		.map(tapStopPropagation)
		// 		.chain(() => eitherTab)
		// 		.map(() => lastIndex(line))
		// 		.map((character) => ({ line: lineIndex, character }))
		// 		.map((position) => [{ start: position, end: position, direction: "ltr" as const }])
		// 		.map((positions) => ({ path, positions }))
		// 		.map((payload) => dispatch({ type: "@editor/update-caret-positions", payload }))
		// 		.fold(...FoldVoid);

		return eitherLine.map(tap(console.log)).fold(NoOp, (l) => (
			<div className="editor_line">
				<LineNumber number={lineIndex + 1} />
				<div
					className={`editor_line_content ${className}`}
					// onClick={handleClick}
				>
					<Token token={l} />
				</div>
			</div>
		));
	},
	() => true,
);

type ReactChildren = Parameters<React.FC>[0];

const useTokenWrapper = (token: Token) =>
	Switch.of(token.type)
		.case(
			BlockTokenType.HEADING,
			Switch.of(token.depth)
				.case(1, ({ children }: ReactChildren) => <h1 className="text-4xl">{children}</h1>)
				.case(2, ({ children }: ReactChildren) => <h2 className="text-3xl">{children}</h2>)
				.case(3, ({ children }: ReactChildren) => <h3 className="text-2xl">{children}</h3>)
				.case(4, ({ children }: ReactChildren) => <h4 className="text-xl font-bold">{children}</h4>)
				.default(({ children }: ReactChildren) => <h5 className="text-lg font-bold">{children}</h5>),
		)
		.case(BlockTokenType.BLOCKQUOTE, ({ children }: ReactChildren) => (
			<blockquote className="border-l border-neutral-600 pl-2">{children}</blockquote>
		))
		.case(InlineTokenType.BOLD, ({ children }: ReactChildren) => <strong>{children}</strong>)
		.case(InlineTokenType.ITALIC, ({ children }: ReactChildren) => <em>{children}</em>)
		.case(InlineTokenType.CODE, ({ children }: ReactChildren) => (
			<code className="px-1 py-0.5 bg-pink-200 rounded-md shadow-md">{children}</code>
		))
		.case(InlineTokenType.LINK, ({ children }: ReactChildren) => (
			<a className="text-pink-700 cursor-pointer underline">{children}</a>
		))
		.case(InlineTokenType.STRIKETHROUGH, ({ children }: ReactChildren) => (
			<span className="line-through">{children}</span>
		))
		.case(InlineTokenType.TAG, ({ children }: ReactChildren) => (
			<span className="font-bold bg-gradient-to-bl from-pink-700 to-neutral-900 text-transparent bg-clip-text drop-shadow-xl">
				{children}
			</span>
		))
		.default(({ children }: ReactChildren) => <span>{children}</span>);

const Token = ({ token }: { token: Token }) => {
	const Wrapper = useTokenWrapper(token);

	return (
		<Wrapper>
			{token.symbols.map((symbol) => (
				<span key={`${symbol.position.start.line}-${symbol.position.start.character}`}>{symbol.value}</span>
			))}
			{(token as TokenWithChildren).children &&
				(token as TokenWithChildren).children.map((child) => (
					<Token key={`${child.position.start.line}-${child.position.start.character}`} token={child} />
				))}

			{token.closingSymbols.map((symbol: any) => (
				<span key={`${symbol.position.start.line}-${symbol.position.start.character}`}>{symbol.value}</span>
			))}
		</Wrapper>
	);
};
