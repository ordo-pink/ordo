// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { getFetch } from "@ordo-pink/frontend-fetch"
import { Oath } from "@ordo-pink/oath"
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject"
import { AuthResponse } from "@ordo-pink/backend-server-id"
import { getLogger } from "@ordo-pink/frontend-logger"
import { callOnce } from "@ordo-pink/tau"
import { Logger } from "@ordo-pink/logger"
import { Either } from "@ordo-pink/either"
import { KnownFunctions } from "@ordo-pink/known-functions"
import Null from "@ordo-pink/frontend-react-components/null"
import { useSharedContext, useSubscription } from "@ordo-pink/frontend-react-hooks"

type InitUserStreamP = { fid: symbol; idHost: string; webHost: string; isDev: boolean }
export const __initAuth$ = callOnce(({ fid, idHost, webHost, isDev }: InitUserStreamP) => {
	const fetch = getFetch(fid)
	const logger = getLogger(fid)
	const refreshToken = refreshToken0({ fetch, idHost, webHost, logger, isDev })

	logger.debug("Initialising auth...")

	refreshToken()

	const beforeUnloadListener = () => {
		clearInterval(interval)
		window.removeEventListener("beforeunload", beforeUnloadListener)
	}

	const interval = setInterval(refreshToken, 50_000) // TODO: Take from ENV

	window.addEventListener("beforeunload", beforeUnloadListener)

	logger.debug("Initialised auth.")
})

export const getIsAuthenticated = (fid: symbol | null) =>
	Either.fromBoolean(() => KnownFunctions.validate(fid))
		.chain(() => Either.fromNullable(auth$.value?.sub))
		.fold(
			() => false,
			() => true,
		)

export const useIsAuthenticated = () => {
	const { fid } = useSharedContext()
	const auth = useSubscription(auth$)

	return Either.fromBoolean(() => KnownFunctions.validate(fid))
		.chain(() => Either.fromNullable(auth))
		.fold(
			() => false,
			() => true,
		)
}

export const getCurrentUserSub = (fid: symbol | null) =>
	Either.fromBoolean(() => KnownFunctions.validate(fid))
		.chain(() => Either.fromNullable(auth$.value?.sub))
		.fold(Null, x => x)

export const getCurrentUserToken = (fid: symbol | null) =>
	Either.of(KnownFunctions.exchange(fid))
		.chain(name => Either.fromBoolean(() => name === "pink.ordo.app"))
		.chain(() => Either.fromNullable(auth$.value?.accessToken))
		.fold(Null, x => x)

export const useCurrentUserSub = () => {
	const { fid } = useSharedContext()
	const auth = useSubscription(auth$)

	return Either.fromBoolean(() => KnownFunctions.validate(fid)).fold(Null, () => auth?.sub ?? null)
}

type RefreshTokenP = {
	fetch: typeof window.fetch
	idHost: string
	webHost: string
	logger: Logger
	isDev: boolean
}
const refreshToken0 =
	({ fetch, logger, idHost, webHost, isDev }: RefreshTokenP) =>
	() =>
		Oath.fromNullable(fetch)
			.tap(logTokenRefreshStart(logger))
			.chain(fetchRefreshToken0(fetch, idHost))
			.chain(getJSONResponse0)
			.chain(checkIsOperationSuccessful0)
			.map(updateAuth(logger))
			.orElse(signOut(logger, webHost, isDev))

const logTokenRefreshStart = (logger: Logger) => () => logger.debug("Refreshing auth token...")

const fetchRefreshToken0 = (fetch: typeof window.fetch, idHost: string) => () =>
	Oath.try(() => fetch(`${idHost}/refresh-token`, { method: "POST", credentials: "include" }))

const getJSONResponse0 = (res: Response) => Oath.from(res.json.bind(res))

const checkIsOperationSuccessful0 = Oath.ifElse<
	{ success: boolean; result: AuthResponse; error: string },
	AuthResponse,
	string
>(res => res.success, { onTrue: res => res.result as AuthResponse, onFalse: res => res.error })

const updateAuth = (logger: Logger) => (auth: AuthResponse) => {
	logger.debug("Auth token refreshed.")
	return auth$.next(auth)
}

const signOut =
	(logger: Logger, webHost: string, isDev: boolean) => (res: string | Error | null) => {
		// Treat an error caused by HMR in dev mode when commands do not get restarted
		if (res instanceof Error && res.message === "Forbidden" && isDev) {
			return window.location.reload()
		}

		logger.error("Token refresh failed. Signing out.")
		window.location.href = `${webHost}/sign-out`
	}

const auth$ = new BehaviorSubject<AuthResponse | null>(null)
