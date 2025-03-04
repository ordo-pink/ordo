import { BackendUserKeys } from "@ordo-pink/backend"
import { CurrentUser } from "@ordo-pink/core"
import { Oath } from "@ordo-pink/oath"
import { default_handler } from "@ordo-pink/backend-util-default-handler"

import { type TIDContext } from "../../backend-id.types"
import { get_user_from_cookie } from "../../common/get-user-from-cookie"

export const handle_invalidate_session = default_handler<TIDContext>(intake =>
	get_user_from_cookie(intake)
		.and(({ sid, uid, user }) =>
			Oath.Resolve(user.to_dto()).and(dto => {
				const sessions = dto[BackendUserKeys.SESSIONS].filter(session => session[0] !== sid)
				dto[BackendUserKeys.SESSIONS] = sessions

				return intake.user_persistence_strategy.update(uid, dto)
			}),
		)
		.and(user => user.to_dto())
		.and(CurrentUser.Serialize)
		.and(dto => void (intake.payload = dto))
		.and(() => intake),
)
