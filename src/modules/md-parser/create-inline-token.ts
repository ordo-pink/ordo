import { InlineTokenType } from "@modules/md-parser/enums";
import { createReader } from "@modules/md-parser/reader";
import { swallow } from "@modules/md-parser/swallow";
import { Token, TokenWithChildren, Symbol } from "@modules/md-parser/types";

export const createInlineToken = <TTokenType extends InlineTokenType>(
	type: TTokenType,
	depth: number,
	data: Token<TTokenType>["data"] = {},
	reader: ReturnType<typeof createReader>,
	symbol: Symbol,
	end = (symbol: Symbol, reader: ReturnType<typeof createReader>): boolean => Boolean(symbol),
): TokenWithChildren<TTokenType> => {
	const token: TokenWithChildren<TTokenType> = {
		type,
		depth,
		position: symbol.position,
		children: [],
		data,
		symbols: [],
	};

	const buildToken = swallow(token);

	while (symbol && !end(symbol, reader)) {
		buildToken(symbol);
		symbol = reader.next()!;
	}

	const result = buildToken();
	return result as TokenWithChildren<TTokenType>;
};
