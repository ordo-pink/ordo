import { InlineTokenType } from "@modules/md-parser/enums";
import { createReader } from "@modules/md-parser/reader";
import { swallow } from "@modules/md-parser/swallow";
import { Token, Symbol } from "@modules/md-parser/types";

export const createInlineToken = <TTokenType extends InlineTokenType>(
	type: TTokenType,
	depth: number,
	data: Token<TTokenType>["data"] = {},
	reader: ReturnType<typeof createReader>,
	symbol: Symbol,
	end = (symbol: Symbol, reader: ReturnType<typeof createReader>): boolean => Boolean(symbol),
): Token<TTokenType> => {
	const token: Token<TTokenType> = {
		type,
		depth,
		position: symbol.position,
		children: [],
		data,
		symbols: [],
		closingSymbols: [],
	};

	const buildToken = swallow(token);

	while (symbol && !end(symbol, reader)) {
		buildToken(symbol);
		symbol = reader.next()!;
	}

	const result = buildToken();
	return result as Token<TTokenType>;
};
