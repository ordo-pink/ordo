import { CurrentUser, UserSubscription } from "@ordo-pink/core"
import { is_non_empty_string, is_string } from "@ordo-pink/tau"
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
		to_dto: () => [
			dto[BackendUserKeys.UID],
			dto[BackendUserKeys.HANDLE],
			dto[BackendUserKeys.CREATED_AT],
			dto[BackendUserKeys.SUBSCRIPTION],
			dto[BackendUserKeys.FIRST_NAME],
			dto[BackendUserKeys.LAST_NAME],
			dto[BackendUserKeys.EMAIL],
			dto[BackendUserKeys.FILE_LIMIT],
			dto[BackendUserKeys.INSTALLED_FUNCTIONS],
			dto[BackendUserKeys.MAX_FUNCTIONS],
			dto[BackendUserKeys.MAX_UPLOAD_SIZE],
			dto[BackendUserKeys.SESSIONS],
			dto[BackendUserKeys.EMAIL_CODE],
			dto[BackendUserKeys.PASSWORD],
		],
	}),

	New: (email, file_limit, max_upload_size, max_functions, subscription = UserSubscription.FREE) => {
		const uid = crypto.randomUUID()
		const handle = `@${email.split("@")[0].replaceAll(".", "_").replaceAll("/", "")}${uid.split("-")[0]}` as Ordo.User.Handle

		const user = []

		user[BackendUserKeys.UID] = uid
		user[BackendUserKeys.HANDLE] = handle
		user[BackendUserKeys.CREATED_AT] = Date.now()
		user[BackendUserKeys.SUBSCRIPTION] = subscription
		user[BackendUserKeys.FIRST_NAME] = void 0
		user[BackendUserKeys.LAST_NAME] = void 0
		user[BackendUserKeys.EMAIL] = email
		user[BackendUserKeys.FILE_LIMIT] = file_limit
		user[BackendUserKeys.INSTALLED_FUNCTIONS] = []
		user[BackendUserKeys.MAX_FUNCTIONS] = max_functions
		user[BackendUserKeys.MAX_UPLOAD_SIZE] = max_upload_size
		user[BackendUserKeys.SESSIONS] = []
		user[BackendUserKeys.EMAIL_CODE] = void 0
		user[BackendUserKeys.PASSWORD] = void 0

		return BackendUser.FromDTO(user as OrdoBackend.User.DTO)
	},
}
