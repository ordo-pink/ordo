import { CurrentUser } from "@ordo-pink/core"
import { default_handler } from "@ordo-pink/backend-util-default-handler"

import { type TIDContext } from "../../backend-id.types"
import { get_user_from_cookie } from "../../common/get-user-from-cookie"

export const handle_get_session = default_handler<TIDContext>(intake =>
	get_user_from_cookie(intake)
		.and(({ user }) => user.to_dto())
		.and(CurrentUser.Serialize)
		.and(dto => void (intake.payload = dto))
		.and(() => intake),
)
