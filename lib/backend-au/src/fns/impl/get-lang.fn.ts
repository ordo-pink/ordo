import { TWO_LETTER_LOCALE } from "@ordo-pink/locale"

// TODO Move to locale lib

export type GetLang = (req: Request) => TWO_LETTER_LOCALE

/**
 * Extracts accepted language from given request. Returns a {@link TWO_LETTER_LOCALE} locale.
 */
export const get_lang: GetLang = req => {
	const accept_language = req.headers.get("Accept-Language")
	return accept_language && accept_language.includes("ru") ? TWO_LETTER_LOCALE.RUSSIAN : TWO_LETTER_LOCALE.ENGLISH
}
