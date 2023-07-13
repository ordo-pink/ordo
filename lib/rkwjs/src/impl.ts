import { ReservedJavaScriptKeyword } from "#lib/rkwjs/mod.ts"

export const RESERVED_JAVASCRIPT_KEYWORDS = [
	"break",
	"case",
	"catch",
	"class",
	"const",
	"continue",
	"debugger",
	"default",
	"delete",
	"do",
	"else",
	"enum",
	"export",
	"extends",
	"false",
	"finally",
	"for",
	"function",
	"if",
	"import",
	"in",
	"instanceof",
	"new",
	"null",
	"return",
	"super",
	"switch",
	"this",
	"throw",
	"true",
	"try",
	"typeof",
	"var",
	"void",
	"while",
	"with",
] as const

export const isReservedJavaScriptKeyword = (
	x: unknown
): x is ReservedJavaScriptKeyword =>
	typeof x === "string" &&
	RESERVED_JAVASCRIPT_KEYWORDS.includes(x as ReservedJavaScriptKeyword)
