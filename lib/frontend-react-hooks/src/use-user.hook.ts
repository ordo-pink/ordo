import { KnownFunctions, QueryPermission } from "@ordo-pink/frontend-known-functions"
import { Either } from "@ordo-pink/either"
import { N } from "@ordo-pink/tau"
import { Switch } from "@ordo-pink/switch"
import { user$ } from "@ordo-pink/frontend-stream-user"

import { useCurrentFID } from "@ordo-pink/frontend-stream-activities"
import { useStrictSubscription } from "./use-strict-subscription.hook"
import { useSubscription } from "./use-subscription.hook"

export const useUser = () => {
	const fid = useCurrentFID()
	const user = useSubscription(user$)

	return Either.fromBoolean(checkPermission(fid, [])).fold(N, () => user)
}

export const useUserID = () => {
	const fid = useCurrentFID()
	const { id } = useStrictSubscription(user$, { id: null } as unknown as User.User)

	return Either.fromBoolean(checkPermission(fid, ["user.id"])).fold(N, () => id)
}

export const useUserEmail = () => {
	const fid = useCurrentFID()
	const { email } = useStrictSubscription(user$, { email: null } as unknown as User.User)

	return Either.fromBoolean(checkPermission(fid, ["user.email"])).fold(N, () => email)
}

export const useUserCreationDate = () => {
	const fid = useCurrentFID()
	const { createdAt } = useStrictSubscription(user$, { createdAt: null } as unknown as User.User)

	return Either.fromBoolean(checkPermission(fid, ["user.createdAt"])).fold(N, () => createdAt)
}

export const useUserSubscriptionStatus = () => {
	const fid = useCurrentFID()
	const { subscription } = useStrictSubscription(user$, {
		subscription: null,
	} as unknown as User.User)

	return Either.fromBoolean(checkPermission(fid, ["user.subscription"])).fold(N, () => subscription)
}

export const useUserName = () => {
	const fid = useCurrentFID()
	const user = useStrictSubscription(user$, {
		firstName: null,
		lastName: null,
	} as unknown as User.User)

	return Either.fromBoolean(checkPermission(fid, ["user.name"])).fold(N, () => ({
		firstName: user.firstName ?? "",
		lastName: user.lastName ?? "",
		fullName: Switch.of(user)
			.case(hasFirstNameAndLastName, user => `${user.firstName} ${user.lastName}`)
			.case(hasFirstName, user => user.firstName!)
			.case(hasLastName, user => user.lastName!)
			.default(() => ""),
	}))
}

// --- Internal ---

const hasFirstName = (user: User.User) => !!user.firstName
const hasLastName = (user: User.User) => !!user.lastName
const hasFirstNameAndLastName = (user: User.User) => hasFirstName(user) && hasLastName(user)
const checkPermission = (fid: symbol | null, queries: QueryPermission[]) => () =>
	KnownFunctions.checkPermissions(fid, { queries })
