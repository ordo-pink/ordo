import { Char, NodeWithChildren, ParseOptions } from "@core/parser/types";
import { createReader } from "@core/parser/reader";
import { lex } from "@core/parser/lexer";
import { noOpFn } from "@utils/functions";

export const parse =
  ({ beforeParse = noOpFn, afterParse = noOpFn, parsers }: ParseOptions) =>
  (raw: string | Char[], tree: NodeWithChildren): void => {
    const chars = typeof raw === "string" ? lex(raw) : raw;
    const reader = createReader(chars);

    let char: Char | null = reader.next();

    if (!char) return;

    beforeParse(tree, reader);

    while (char) {
      for (const parser of parsers) {
        if (parser.evaluate(char, tree, reader)) {
          char = parser.parse(char, tree, reader);
          break;
        }
      }
    }

    afterParse(tree, reader);
  };
