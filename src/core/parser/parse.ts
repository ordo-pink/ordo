import { createReader } from "@core/parser/reader";
import { Char, DocumentRoot, NodeWithChildren, Reader } from "@core/parser/types";
import { lex } from "@core/parser/lexer";
import { noOpFn } from "@utils/no-op";

type ParseHook = (tree: NodeWithChildren | DocumentRoot, reader: Reader) => void;
type Parser = {
	evaluate: (char: Char | null, tree: NodeWithChildren | DocumentRoot, reader: Reader) => boolean;
	parse: (char: Char | null, tree: NodeWithChildren | DocumentRoot, reader: Reader) => Char | null;
};
type ParseOptions = {
	beforeParse?: ParseHook;
	afterParse?: ParseHook;
	parsers: Parser[];
};

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
