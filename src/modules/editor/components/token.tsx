import React from "react";

import { Character } from "@modules/editor/components/char";
import { useCurrentTab } from "../hooks/use-current-tab";
import { Node } from "@core/parser/types";
import { isNodeWithChars, isNodeWithChildren } from "@core/parser/is";
import { useTokenWrapper } from "../hooks/use-token-wrapper";
import { useAppSelector } from "@core/state/store";

export const Token = React.memo(
	({ token, lineIndex }: { token: Node; lineIndex?: number }) => {
		const { tab } = useCurrentTab();
		const Wrapper = useTokenWrapper(
			token,
			tab?.caretPositions.some((position) => position.start.line === token.range.start.line),
		);
		const alwaysShowMarkdownSymbols = useAppSelector((state) => state.app.userSettings.editor.alwaysShowMarkdownSymbols);
		const isCurrentLine = React.useMemo(
			() => tab && tab.caretPositions.some((position) => position.start.line === token.range.start.line),
			[tab && tab.caretPositions.length, tab && tab.caretPositions[0].start.line, token && token.range.start.line],
		);

		return tab ? (
			<Wrapper>
				{isNodeWithChars(token) &&
					token.chars.map((char) => <Character key={`${token.id}-${char.position.character}`} char={char} />)}
				{isNodeWithChildren(token) && (
					<span>
						{(alwaysShowMarkdownSymbols || isCurrentLine) &&
							token.openingChars.map((char) => <Character key={`${token.id}-${char.position.character}`} char={char} />)}
						{token.children.map((child) => (
							<Token key={`${child.id}`} token={child} lineIndex={lineIndex} />
						))}
						{(alwaysShowMarkdownSymbols || isCurrentLine) &&
							token.closingChars.map((char) => <Character key={`${token.id}-${char.position.character}`} char={char} />)}
					</span>
				)}
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
