import { BlockTokenType, SymbolType } from "@modules/md-parser/enums";
import { createReader } from "@modules/md-parser/reader";
import { swallow } from "@modules/md-parser/swallow";
import { MdNode, MdSymbol } from "@modules/md-parser/types";

export const createBlockToken = <TTokenType extends BlockTokenType>(
	type: TTokenType,
	depth: number,
	data: MdNode<TTokenType>["data"] = {},
	reader: ReturnType<typeof createReader>,
	symbol: MdSymbol,
	end = (symbol: MdSymbol, reader: ReturnType<typeof createReader>) => symbol.type === SymbolType.EOL,
): MdNode<TTokenType> => {
	const token: MdNode<TTokenType> = {
		type,
		depth,
		position: symbol.position,
		children: [],
		data,
		raw: "",
		symbols: [],
		closingSymbols: [],
	};

	const buildToken = swallow(token);

	while (symbol && !end(symbol, reader)) {
		const back = reader.backTrack();
		const back2 = reader.backTrack(2);
		const ahead = reader.lookAhead();

		if (
			symbol &&
			(symbol.type === SymbolType.TAB ||
				(symbol.type === SymbolType.WHITESPACE && ahead && ahead.type === SymbolType.WHITESPACE)) &&
			(!back ||
				back.type === SymbolType.EOL ||
				back.type === SymbolType.TAB ||
				(back2 && back2.type === SymbolType.WHITESPACE)) &&
			token.type !== BlockTokenType.LIST &&
			token.type !== BlockTokenType.CODE_BLOCK
		) {
			depth++;
		}

		buildToken(symbol);
		symbol = reader.next()!;
	}

	const result = buildToken();
	result.depth = depth;
	return result;
};
