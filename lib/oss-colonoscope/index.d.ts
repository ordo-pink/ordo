import type * as Lib from "./src/colonoscope.types.ts"

declare module colonoscope {
	export const is_doctor: Lib.IsDoctor
	export const check: Lib.Check
}
