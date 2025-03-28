import { Switch } from "@ordo-pink/switch"
import { TWO_LETTER_LOCALE } from "@ordo-pink/locale"

import { BackendAuth } from "../../backend-au.types"

// TODO Email body creation

export const create_request_code_email_body = (lang: TWO_LETTER_LOCALE, code: BackendAuth.Code) =>
	Switch.Match(lang)
		.case(TWO_LETTER_LOCALE.RUSSIAN, () => code)
		.default(() => code)
