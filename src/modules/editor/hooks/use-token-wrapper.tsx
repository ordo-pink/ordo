import React from "react";
import { Switch } from "or-else";

import { BlockTokenType, InlineTokenType } from "@modules/md-parser/enums";
import { Token, ListToken } from "@modules/md-parser/types";

type ReactChildren = Parameters<React.FC>[0];

export const useTokenWrapper = (token: Token) => {
	const Wrapper = React.useMemo(
		() =>
			Switch.of(token.type)
				.case(
					BlockTokenType.HEADING,
					Switch.of(token.depth)
						.case(1, ({ children }: ReactChildren) => <h1 className="text-4xl font-semibold">{children}</h1>)
						.case(2, ({ children }: ReactChildren) => <h2 className="text-3xl font-semibold">{children}</h2>)
						.case(3, ({ children }: ReactChildren) => <h3 className="text-2xl font-semibold">{children}</h3>)
						.case(4, ({ children }: ReactChildren) => <h4 className="text-xl font-semibold">{children}</h4>)
						.default(({ children }: ReactChildren) => <h5 className="text-lg font-semibold">{children}</h5>),
				)
				.case(BlockTokenType.BLOCKQUOTE, ({ children }: ReactChildren) => (
					<blockquote className="border-l border-neutral-600 pl-2">{children}</blockquote>
				))
				.case(BlockTokenType.LIST, ({ children }: ReactChildren) =>
					(token as ListToken).data.ordered ? <ol>{children}</ol> : <ul>{children}</ul>,
				)
				.case(BlockTokenType.LIST_ITEM, ({ children }: ReactChildren) => <li>{children}</li>)
				.case(InlineTokenType.BOLD, ({ children }: ReactChildren) => <strong>{children}</strong>)
				.case(InlineTokenType.ITALIC, ({ children }: ReactChildren) => <em>{children}</em>)
				.case(InlineTokenType.CODE, ({ children }: ReactChildren) => (
					<code className="px-2 py-0.5 bg-rose-200 text-rose-700 rounded-md shadow-sm">{children}</code>
				))
				.case(InlineTokenType.LINK, ({ children }: ReactChildren) => (
					<span className="text-pink-700 underline">{children}</span>
				))
				.case(InlineTokenType.STRIKETHROUGH, ({ children }: ReactChildren) => (
					<span className="line-through">{children}</span>
				))
				.case(InlineTokenType.TAG, ({ children }: ReactChildren) => (
					<span className="font-bold bg-gradient-to-bl from-sky-700 to-lime-700 text-transparent bg-clip-text drop-shadow-xl">
						{children}
					</span>
				))
				.default(({ children }: ReactChildren) => <span>{children}</span>),
		[token.type, token.depth],
	);

	return Wrapper;
};
