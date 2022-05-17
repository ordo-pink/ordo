import { InlineTokenType } from "@modules/md-parser/enums";
import { createReader } from "@modules/md-parser/reader";
import { swallow } from "@modules/md-parser/swallow";
import { MdNode, MdSymbol } from "@modules/md-parser/types";

export const createInlineToken = <TTokenType extends InlineTokenType>(
	type: TTokenType,
	depth: number,
	data: MdNode<TTokenType>["data"] = {},
	reader: ReturnType<typeof createReader>,
	symbol: MdSymbol,
	end = (symbol: MdSymbol, reader: ReturnType<typeof createReader>): boolean => Boolean(symbol),
): MdNode<TTokenType> => {
	const token: MdNode<TTokenType> = {
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
	return result as MdNode<TTokenType>;
};
