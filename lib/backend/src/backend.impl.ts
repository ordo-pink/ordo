import { is_non_empty_string, is_string } from "@ordo-pink/tau"
import { CurrentUser } from "@ordo-pink/core"
import { Oath } from "@ordo-pink/oath"

import { BackendUserKeys } from "./backend.constants"

export const BackendUser: OrdoBackend.User.Static = {
	Validations: {
		...(CurrentUser.Validations as any),
		is_email_code: (x): x is OrdoBackend.User.DTO[BackendUserKeys.EMAIL_CODE] => is_string(x) && x.length === 6,
		is_password: (x): x is OrdoBackend.User.DTO[BackendUserKeys.PASSWORD] => is_non_empty_string(x),
	},

	FromDTO: dto => ({
		...CurrentUser.FromDTO(dto),
		validate_code: code =>
			Oath.FromNullable(dto[BackendUserKeys.EMAIL_CODE])
				.and(user_code => Oath.FromPromise(() => Bun.password.verify(code, user_code)))
				.fix(() => false),
		validate_password: () => Oath.Resolve(false),
	}),
}
