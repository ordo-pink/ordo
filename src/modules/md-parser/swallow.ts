import { Token, Symbol } from "@modules/md-parser/types";

export const swallow =
	<TToken extends Token>(block: TToken) =>
	(symbol?: Symbol): TToken => {
		if (!symbol) {
			return block;
		}

		block.position.end.character++;
		block.position.end.offset++;
		block.symbols.push(symbol as any);

		return block;
	};
