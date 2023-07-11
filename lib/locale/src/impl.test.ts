import { tsushi } from "../../tsushi/mod.ts"
import { TwoLetterLocale, TwoLetterLocaleReadableName } from "./impl.ts"
import { twoLetterLocaleToReadableName } from "./impl.ts"

const t = tsushi()

t.group("locale", ({ test, todo }) => {
	const locale = Object.values(TwoLetterLocale).filter(value =>
		Number.isNaN(Number(value))
	)[0]

	test(`twoLetterLocaleToReadableName should provide valid readable name`, ({
		expect,
	}) =>
		expect(twoLetterLocaleToReadableName(locale)).toEqual(
			TwoLetterLocaleReadableName[locale]
		))
})
