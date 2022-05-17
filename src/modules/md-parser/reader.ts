import { MdSymbol } from "@modules/md-parser/types";
import { lex } from "@modules/md-parser/lexer";

export const createReader = (data: string | MdSymbol[]) => {
	let i = -1;
	const symbols = typeof data === "string" ? lex(data) : data;

	return {
		next: () => {
			if (i === symbols.length - 1) {
				return null;
			}

			i++;
			return symbols[i];
		},
		lookAhead: (offset = 1) => (i + offset < symbols.length ? symbols[i + offset] : null),
		backTrack: (offset = 1) => (i - offset > 0 ? symbols[i - offset] : null),
		currentIndex: () => i,
	};
};
