import { F, T } from "ramda"

import { Either } from "@ordo-pink/either"
import { KnownFunctions } from "@ordo-pink/frontend-known-functions"
import { auth$ } from "@ordo-pink/frontend-stream-user"

import { useCurrentFID } from "@ordo-pink/frontend-stream-activities"
import { useSubscription } from "./use-subscription.hook"

export const useIsAuthenticated = () => {
	const fid = useCurrentFID()
	const auth = useSubscription(auth$)

	return Either.fromBoolean(() => KnownFunctions.checkPermissions(fid, { queries: [] }))
		.chain(() => Either.fromNullable(auth))
		.fold(F, T)
}
