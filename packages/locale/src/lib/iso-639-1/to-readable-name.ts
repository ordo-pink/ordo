import { TwoLetterLocale } from "./locale"
import { TwoLetterLocaleReadableName } from "./readable-name"

export const twoLetterLocaleToReadableName = (locale: TwoLetterLocale) =>
  TwoLetterLocaleReadableName[locale]
