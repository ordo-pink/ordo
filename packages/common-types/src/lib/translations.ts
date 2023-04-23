import { ISO_639_1_Locale } from "@ordo-pink/locale"
import { UnaryFn } from "./types"

export type Bundle = Partial<Record<ISO_639_1_Locale, Record<string, string>>>

export type LanguageResource = {
  language: ISO_639_1_Locale
  ns: string
  resources: Record<string, string>
}

export type RegisterTranslationsFn = UnaryFn<string, UnaryFn<Bundle, void>>
