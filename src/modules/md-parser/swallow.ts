import { MdNode, MdSymbol } from "@modules/md-parser/types";

export const swallow =
	<TToken extends MdNode>(block: TToken) =>
	(symbol?: MdSymbol): TToken => {
		if (!symbol) {
			return block;
		}

		block.position.end.character = symbol.position.start.character;
		block.position.end.offset = symbol.position.start.offset;
		block.symbols.push(symbol as any);

		return block;
	};
