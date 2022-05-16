import React from "react";

import { InlineTokenType } from "@modules/md-parser/enums";
import { TokenWithChildren, Token as TToken } from "@modules/md-parser/types";
import { useCurrentPositions } from "@modules/editor/hooks/use-current-positions";
import { useTokenWrapper } from "@modules/editor/hooks/use-token-wrapper";
import { Char } from "@modules/editor/components/char";
import { NoOp } from "@utils/no-op";

export const Token = ({ token }: { token: TToken }) => {
	const Wrapper = useTokenWrapper(token);
	const eitherPositions = useCurrentPositions();

	return eitherPositions.fold(NoOp, (p) => (
		<Wrapper>
			{
				<span
					className={
						!(token as any).children || token.type === InlineTokenType.TEXT || p[0].start.line === token.position.start.line
							? "inline"
							: "hidden"
					}
				>
					{token.symbols.map((symbol) => (
						<Char key={`${symbol.position.start.line}-${symbol.position.start.character}`} char={symbol} />
					))}
				</span>
			}
			{(token as TokenWithChildren).children &&
				(token as TokenWithChildren).children.map((child) => (
					<Token key={`${child.position.start.line}-${child.position.start.character}`} token={child} />
				))}

			<span className={!(token as any).children || p[0].start.line === token.position.start.line ? "inline" : "hidden"}>
				{token.closingSymbols.map((symbol: any) => (
					<Char key={`${symbol.position.start.line}-${symbol.position.start.character}`} char={symbol} />
				))}
			</span>
		</Wrapper>
	));
};
