import { CharType } from "@core/parser/char-type";

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
};

export type NodeRange = {
	start: Position;
	end: Position;
};

export type Char<Data = null> = {
	type: CharType;
	value: string;
	position: Position;
	data: Data;
};

export type Node<TypeSource = string, Data = null> = {
	id: string;
	depth: number;
	type: TypeSource;
	range: NodeRange;
	raw: string;
	data: Data;
};

export type ChildrenAware = {
	children: Node[];
};

export type CharsAware<CharData = null> = {
	chars: Char<CharData>[];
};

export type NodeWithChildren<TypeSource = string, Data = null> = Node<TypeSource, Data> & ChildrenAware;

export type NodeWithChars<TypeSource = string, Data = null, CharData = null> = Node<TypeSource, Data> &
	CharsAware<CharData>;

export type DocumentRoot<Data = null> = NodeWithChildren & {
	type: "root";
	path: string;
	length: number;
	data: Data;
};
