import { Either } from "or-else";

import { MdSymbol } from "@modules/md-parser/types";
import { SymbolType } from "@modules/md-parser/enums";
import { getSymbolType } from "@modules/md-parser/get-symbol-type";

export const lex = (text: string): MdSymbol[] =>
	Either.fromNullable(text).fold(
		() => [],
		(t) => {
			let line = 1;
			let character = 1;

			return t.split("").map((value, offset) => {
				const type = getSymbolType(value);

				const result = {
					type,
					value,
					position: {
						start: {
							line,
							character,
							offset,
						},
						end: {
							line,
							character: character + 1,
							offset: offset + 1,
						},
					},
				};

				character++;

				if (type === SymbolType.EOL) {
					line++;
					character = 1;
				}

				return result;
			});
		},
	);
