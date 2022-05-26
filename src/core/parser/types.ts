import { CharType } from "@core/parser/char-type";

export type ParseHook = (tree: NodeWithChildren | DocumentRoot, reader: Reader) => void;
export type EvaluateFn = (char: Char | null, tree: NodeWithChildren | DocumentRoot, reader: Reader) => boolean;
export type ParseFn = (char: Char | null, tree: NodeWithChildren | DocumentRoot, reader: Reader) => Char | null;
export type Parser = {
	evaluate: EvaluateFn;
	parse: ParseFn;
};
export type ParseOptions = {
	beforeParse?: ParseHook;
	afterParse?: ParseHook;
	parsers: Parser[];
};

export type Reader = {
	next: () => Char | null;
	current: () => Char | null;
	lookAhead: (offset?: number) => Char | null;
	backTrack: (offset?: number) => Char | null;
	currentIndex: () => number;
	getChars: () => Char[];
	length: number;
};

export type Position = {
	line: number;
	character: number;
	offset: number;
};

export type NodeRange = {
	start: Position;
	end: Position;
};

export type Char = {
	type: CharType;
	value: string;
	position: Position;
};

export type Node<TypeSource = string, Data = Record<string, unknown> | null> = {
	id: string;
	depth: number;
	type: TypeSource;
	range: NodeRange;
	raw: string;
	data: Data;
};

export type ChildrenAware = {
	openingChars: Char[];
	closingChars: Char[];
	children: Node[];
};

export type CharsAware = {
	chars: Char[];
};

export type NodeWithChildren<TypeSource = string, Data = Record<string, unknown>> = Node<TypeSource, Data> &
	ChildrenAware;

export type NodeWithChars<TypeSource = string, Data = Record<string, unknown>> = Node<TypeSource, Data> & CharsAware;

export type DocumentRoot<Data = Record<string, unknown>> = NodeWithChildren<
	"root",
	Data & { path: string; length: number; frontmatter: Record<string, any> | null }
>;
