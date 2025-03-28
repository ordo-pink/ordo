import { Switch } from "@ordo-pink/switch"
import { TWO_LETTER_LOCALE } from "@ordo-pink/locale"

// TODO Email body creation

export const create_user_authenticated_email_body = (lang: TWO_LETTER_LOCALE, request_ip: string) =>
	Switch.Match(lang)
		.case(TWO_LETTER_LOCALE.RUSSIAN, () => request_ip)
		.default(() => request_ip)
