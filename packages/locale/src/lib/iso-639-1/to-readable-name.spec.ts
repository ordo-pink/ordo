import { TwoLetterLocale } from "./locale"
import { TwoLetterLocaleReadableName } from "./readable-name"
import { twoLetterLocaleToReadableName } from "./to-readable-name"

describe("twoLetterLocaleToReadableName", () => {
  const locales = Object.values(TwoLetterLocale).filter((value) => Number.isNaN(Number(value)))

  locales.forEach((locale) => {
    it("should provide valid readable name", () =>
      expect(twoLetterLocaleToReadableName(locale)).toEqual(TwoLetterLocaleReadableName[locale]))
  })
})
