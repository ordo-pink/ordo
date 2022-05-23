import React from "react";

import { Character } from "@modules/editor/components/char";
import { useCurrentTab } from "../hooks/use-current-tab";
import { Node } from "@core/parser/types";
import { isNodeWithChars, isNodeWithChildren } from "@core/parser/is";
import { useTokenWrapper } from "../hooks/use-token-wrapper";

export const Token = React.memo(
	({ token, lineIndex }: { token: Node; lineIndex?: number }) => {
		const { tab } = useCurrentTab();
		const Wrapper = useTokenWrapper(
			token,
			tab?.caretPositions.some((position) => position.start.line === token.range.start.line),
		);

		return tab ? (
			<Wrapper>
				{isNodeWithChars(token) &&
					token.chars.map((symbol) => <Character key={`${token.id}-${symbol.position.character}`} char={symbol} />)}
				{isNodeWithChildren(token) &&
					token.children.map((child) => <Token key={`${child.id}`} token={child} lineIndex={lineIndex} />)}
			</Wrapper>
		) : null;
	},
	(prev, next) =>
		prev.token.type === next.token.type &&
		prev.token.raw === next.token.raw &&
		prev.token.range.start.character === next.token.range.start.character &&
		prev.token.range.start.line === next.token.range.start.line &&
		prev.token.range.end.character === next.token.range.end.character &&
		prev.token.range.end.line === next.token.range.end.line &&
		prev.token.depth === next.token.depth,
);
