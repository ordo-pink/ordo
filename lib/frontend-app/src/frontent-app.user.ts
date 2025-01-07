import { CurrentUserRepository, PublicUserRepository, RRR, UserQuery } from "@ordo-pink/core"
import { ConsoleLogger } from "@ordo-pink/logger"
import { Result } from "@ordo-pink/result"
import { ZAGS } from "@ordo-pink/zags"
import { call_once } from "@ordo-pink/tau"

import { ordo_app_state } from "../app.state"

export const init_user = call_once(() => {
	const { known_functions, logger } = ordo_app_state.zags.unwrap()

	logger.debug("🟡 Initialising metadata...")

	const current_user_repository = CurrentUserRepository.Of(current_user$)
	const public_user_repository = PublicUserRepository.Of(public_user$)

	// TODO Auth commands

	const user_query = UserQuery.Of(current_user_repository, public_user_repository, () => Result.Ok(void 0))

	ordo_app_state.zags.update("queries.user", () => user_query)

	logger.debug("🟢 Initialised metadata.")

	return {
		get_user_query: (fid: symbol) =>
			UserQuery.Of(current_user_repository, public_user_repository, permission =>
				Result.If(known_functions.has_permissions(fid, { queries: [permission] }), {
					F: () => {
						const rrr = eperm(`MetadataQuery permission RRR. Did you forget to request query permission '${permission}'?`)
						ConsoleLogger.error(rrr.debug?.join(" "))
						return rrr
					},
				}),
			),
	}
})

// --- Internal ---

// TODO Move to ordo_app_state
const current_user$ = ZAGS.Of({ user: null as Ordo.User.Current.Instance | null })
const public_user$ = ZAGS.Of({ known_users: [] as Ordo.User.Public.Instance[] })

const eperm = RRR.codes.eperm("UserQuery")
