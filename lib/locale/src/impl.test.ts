import {
	TwoLetterLocale,
	TwoLetterLocaleReadableName,
	twoLetterLocaleToReadableName,
} from "./impl.ts"

import { assertEquals } from "#std/testing/asserts.ts"

Deno.test("locale", () => {
	const locale = Object.values(TwoLetterLocale).filter(value => Number.isNaN(Number(value)))[0]

	assertEquals(twoLetterLocaleToReadableName(locale), TwoLetterLocaleReadableName[locale])
})
