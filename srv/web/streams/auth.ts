import type { Nullable } from "#lib/tau/mod.ts"
import type { AuthResponse } from "#lib/backend-id-server/mod.ts"

import { BehaviorSubject, combineLatestWith, map } from "#x/rxjs@v1.0.2/mod.ts"
import { User } from "#lib/backend-user-service/mod.ts"
import { Directory, File } from "#lib/universal-data-service/mod.ts"
import { Oath } from "#lib/oath/mod.ts"
import { useSubscription } from "../hooks/use-subscription.ts"
import { Either } from "#lib/either/mod.ts"
import { executeCommand } from "./commands.ts"

export type Hosts = { idHost: string; dataHost: string }
type APIRepositoryParams = { hosts: Hosts; auth: AuthResponse }

const hosts$ = new BehaviorSubject<Nullable<Hosts>>(null)
const auth$ = new BehaviorSubject<Nullable<AuthResponse>>(null)
const metadata$ = new BehaviorSubject<(Directory | File)[]>([])
const user$ = new BehaviorSubject<Nullable<User>>(null)
const error$ = new BehaviorSubject<Nullable<string>>(null)

const userService$ = auth$.pipe(
	combineLatestWith(hosts$),
	map(([auth, hosts]) => (auth && hosts ? createUserRepository({ hosts, auth }) : null))
)

const metadataService$ = auth$.pipe(
	combineLatestWith(hosts$),
	map(([auth, hosts]) => (auth && hosts ? createMetadataService({ hosts, auth }) : null))
)

export const refreshAuthInfo = (info: AuthResponse) => {
	auth$.next(info)
}

export const initHosts = (hosts: Hosts) => hosts$.next(hosts)

export const signOut = () => {
	auth$.next(null)
	metadata$.next([])
	user$.next(null)
	error$.next(null)
	executeCommand("router.open-external", { url: "/sign-out", newTab: false })
}

export const isSignedIn = () => auth$.value !== null

export const useAuthStatus = () => {
	const auth = useSubscription(auth$)
	return auth != null
}

export const useMetadataAPIService0 = () => {
	const repository = useSubscription(metadataService$)
	return Oath.fromNullable(repository)
}

export const useUserAPIService0 = () => {
	const repository = useSubscription(userService$)
	return Oath.fromNullable(repository)
}

export const useMetadata = () => {
	const metadata = useSubscription(metadata$)
	return Either.fromNullable(metadata)
}
export const useUser = () => {
	const user = useSubscription(user$)
	return Either.fromNullable(user)
}
export const useError = () => useSubscription(error$)

const createUserRepository = ({ hosts, auth }: APIRepositoryParams) => ({
	getCurrentUserAccount: () =>
		Oath.from(() =>
			fetch(`${hosts.idHost}/account`, { headers: { Authorization: `Bearer ${auth.accessToken}` } })
		)
			.chain(res => Oath.from(() => res.json())) // TODO: Unify ID with Data ({ success boolean, result value })
			.tap(result => user$.next(result)),
})

const createMetadataService = ({ hosts, auth }: APIRepositoryParams) => ({
	getRoot: () =>
		Oath.from(() =>
			fetch(`${hosts.dataHost}/directories/${auth.sub}`, {
				headers: { Authorization: `Bearer ${auth.accessToken}` },
			})
		)
			.chain(res => Oath.from(() => res.json()))
			.chain(body => (body.success ? Oath.of(body.result) : Oath.reject(body.error)))
			.tap(
				result => metadata$.next(result),
				error => error$.next(error)
			),
})
