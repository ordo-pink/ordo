import { Either } from "or-else";

import { getSymbolType } from "@core/parser/get-symbol-type";
import { CharType } from "@core/parser/char-type";
import { Char } from "@core/parser/types";

export const lex = (text: string, initialLine = 1, initialChar = 1): Char[] =>
	Either.fromNullable(text).fold(
		() => [] as Char[],
		(t) => {
			let line = initialLine;
			let character = initialChar;

			return t.split("").map((value, offset) => {
				const type = getSymbolType(value);

				const result: Char = {
					type,
					value,
					position: {
						line,
						character,
						offset,
					},
				};

				character++;

				if (type === CharType.EOL) {
					line++;
					character = 1;
				}

				return result;
			});
		},
	);
