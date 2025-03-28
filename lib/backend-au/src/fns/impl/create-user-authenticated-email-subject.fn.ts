import { Switch } from "@ordo-pink/switch"
import { TWO_LETTER_LOCALE } from "@ordo-pink/locale"

export const create_user_authenticated_email_subject = (lang: TWO_LETTER_LOCALE) =>
	Switch.Match(lang)
		.case(TWO_LETTER_LOCALE.RUSSIAN, () => "Зафиксирован вход в ваш аккаунт ORDO")
		.default(() => "Someone just signed in to your ORDO account")
