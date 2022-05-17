import React from "react";

import { BlockTokenType, InlineTokenType } from "@modules/md-parser/enums";
import { MdNode as TToken } from "@modules/md-parser/types";
import { useTokenWrapper } from "@modules/editor/hooks/use-token-wrapper";
import { Char } from "@modules/editor/components/char";
import { useCurrentTab } from "../hooks/use-current-tab";
import { Caret } from "./caret";

export const Token = React.memo(
	({ token, lineIndex }: { token: TToken; lineIndex?: number }) => {
		const Wrapper = useTokenWrapper(token);
		const { tab } = useCurrentTab();

		return tab ? (
			<Wrapper>
				<Caret
					visible={
						lineIndex != null &&
						tab.caretPositions[0].start.line === lineIndex + 1 &&
						tab.caretPositions[0].start.character === 0
					}
				/>
				{
					<span
						className={
							!(token as any).children ||
							token.type === InlineTokenType.TAG ||
							token.type === InlineTokenType.TEXT ||
							token.type === InlineTokenType.LINK ||
							token.type === BlockTokenType.EMBED ||
							tab.caretPositions[0].start.line === token.position.start.line
								? "inline"
								: "hidden"
						}
					>
						{token.symbols.map((symbol) => (
							<Char key={`${symbol.position.start.line}-${symbol.position.start.character}`} char={symbol} />
						))}
					</span>
				}
				{token.children &&
					token.children.map((child) => (
						<Token key={`${child.position.start.line}-${child.position.start.character}`} token={child} />
					))}

				<span
					className={
						!(token as any).children ||
						token.type === InlineTokenType.LINK ||
						tab.caretPositions[0].start.line === token.position.start.line
							? "inline"
							: "hidden"
					}
				>
					{token.closingSymbols.map((symbol: any) => (
						<Char key={`${symbol.position.start.line}-${symbol.position.start.character}`} char={symbol} />
					))}
				</span>
			</Wrapper>
		) : null;
	},
	(prev, next) =>
		prev.token.type === next.token.type &&
		prev.token.position.start.character === next.token.position.start.character &&
		prev.token.position.start.line === next.token.position.start.line &&
		prev.token.position.end.character === next.token.position.end.character &&
		prev.token.position.end.line === next.token.position.end.line &&
		prev.token.depth === next.token.depth,
);
