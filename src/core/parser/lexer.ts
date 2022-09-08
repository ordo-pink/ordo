import { getSymbolType } from "@core/parser/get-symbol-type";
import { CharType } from "@core/parser/char-type";
import { Char } from "@core/parser/types";

export const lex = (text: string, initialLine = 1, initialChar = 1): Char[] => {
  if (!text) return [];

  let line = initialLine;
  let character = initialChar;

  const characters = text.split("");

  const result = characters.map((value, offset) => {
    const type = getSymbolType(value);
    const position = { line, character, offset };
    const char: Char = { type, value, position };

    if (type === CharType.EOL) {
      line++;
      character = 1;
    } else {
      character++;
    }

    return char;
  });

  return result;
};
