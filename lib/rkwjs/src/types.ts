import { RESERVED_JAVASCRIPT_KEYWORDS } from "./impl.ts"

export type ReservedJavaScriptKeyword =
	(typeof RESERVED_JAVASCRIPT_KEYWORDS)[number]
