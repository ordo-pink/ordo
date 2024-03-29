// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { F, T, identity } from "ramda"
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject"

import { N, callOnce } from "@ordo-pink/tau"
import { type AuthResponse } from "@ordo-pink/backend-server-id"
import { Either } from "@ordo-pink/either"
import { KnownFunctions } from "@ordo-pink/frontend-known-functions"
import { type Logger } from "@ordo-pink/logger"
import { Oath } from "@ordo-pink/oath"
import { getFetch } from "@ordo-pink/frontend-fetch"
import { getHosts } from "@ordo-pink/frontend-react-hooks"
import { getLogger } from "@ordo-pink/frontend-logger"

type InitUserStreamP = { fid: symbol; isDev: boolean }
export const __initAuth$ = callOnce(({ fid, isDev }: InitUserStreamP) => {
	const { idHost, websiteHost } = getHosts()
	const fetch = getFetch(fid)
	const logger = getLogger(fid)
	const refreshToken = refreshToken0({ fetch, idHost, websiteHost, logger, isDev })

	logger.debug("Initialising auth...")

	void refreshToken()

	const beforeUnloadListener = () => {
		clearInterval(interval)
		window.removeEventListener("beforeunload", beforeUnloadListener)
	}

	const interval = setInterval(() => void refreshToken(), 50_000) // TODO: Take from ENV

	window.addEventListener("beforeunload", beforeUnloadListener)

	logger.debug("Initialised auth.")
})

export const getIsAuthenticated = (fid: symbol | null) =>
	Either.fromBoolean(() =>
		KnownFunctions.checkPermissions(fid, { queries: ["auth.is-authenticated"] }),
	)
		.chain(() => Either.fromNullable(auth$.value?.sub))
		.fold(F, T)

export const getCurrentUserToken = (fid: symbol | null) =>
	Either.of(KnownFunctions.checkPermissions(fid, { queries: [] }))
		.chain(() => Either.fromNullable(auth$.value?.accessToken))
		.fold(N, identity)

type RefreshTokenP = {
	fetch: typeof window.fetch
	idHost: string
	websiteHost: string
	logger: Logger
	isDev: boolean
}
const refreshToken0 =
	({ fetch, logger, idHost, websiteHost, isDev }: RefreshTokenP) =>
	() =>
		Oath.fromNullable(fetch)
			.tap(logTokenRefreshStart(logger))
			.chain(fetchRefreshToken0(fetch, idHost))
			.chain(getJSONResponse0)
			.chain(checkIsOperationSuccessful0)
			.map(updateAuth(logger))
			.orElse(signOut(logger, websiteHost, isDev))

const logTokenRefreshStart = (logger: Logger) => () => logger.debug("Refreshing auth token...")

const fetchRefreshToken0 = (fetch: typeof window.fetch, idHost: string) => () =>
	Oath.try(() => fetch(`${idHost}/refresh-token`, { method: "POST", credentials: "include" }))

const getJSONResponse0 = (res: Response) => Oath.from(res.json.bind(res))

const checkIsOperationSuccessful0 = Oath.ifElse<
	{ success: boolean; result: AuthResponse; error: string },
	AuthResponse,
	string
>(res => res.success, { onTrue: res => res.result, onFalse: res => res.error })

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

export const auth$ = new BehaviorSubject<AuthResponse | null>(null)
