import { Switch } from "@ordo-pink/switch"
import { TWO_LETTER_LOCALE } from "@ordo-pink/locale"

export const create_request_code_email_subject = (lang: TWO_LETTER_LOCALE) =>
	Switch.Match(lang)
		.case(TWO_LETTER_LOCALE.RUSSIAN, () => "Добро пожаловать в ORDO!")
		.default(() => "Welcome to ORDO!")
