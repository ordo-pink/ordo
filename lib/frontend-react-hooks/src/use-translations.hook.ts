import { O } from "@ordo-pink/option"
import { TwoLetterLocale } from "@ordo-pink/locale"

import { use$ } from ".."

export const useTranslation = () => {
	const current_language = useCurrentLanguage()

	const { get_translations } = use$.ordo_context()
	const translations$ = get_translations()
	const translations_option = use$.strict_subscription(translations$, O.None())

	return (key: string) => {
		const translations = translations_option
			.pipe(O.ops.map(ts => ts[current_language] ?? ({} as Record<string, string>)))
			.cata({ Some: ts => ts, None: () => ({}) as Record<string, string> })

		const result = translations[key]

		return result != null ? result : key
	}
}

export const useScopedTranslation = (prefix = "common") => {
	const current_language = useCurrentLanguage()

	const { get_translations } = use$.ordo_context()
	const translations$ = get_translations()
	const translations_option = use$.strict_subscription(translations$, O.None())

	return (key: string) => {
		const translations = translations_option
			.pipe(O.ops.map(ts => ts[current_language] ?? ({} as Record<string, string>)))
			.cata({ Some: ts => ts, None: () => ({}) as Record<string, string> })

		const scoped_key = `${prefix}.${key}`

		const result = translations[scoped_key]

		return result != null ? result : scoped_key
	}
}

/**
 * TODO: Get from user settings
 */
export const useCurrentLanguage = () => TwoLetterLocale.ENGLISH
