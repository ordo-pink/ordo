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

import { BehaviorSubject, type Observable, map } from "rxjs"

import { O, type TOption } from "@ordo-pink/option"
import { T, call_once } from "@ordo-pink/tau"
import { type TFetch, type TGetIsAuthenticatedFn, type THosts } from "@ordo-pink/core"
import { type AuthResponse } from "@ordo-pink/backend-server-id"
import { KnownFunctions } from "@ordo-pink/frontend-known-functions"
import { Oath } from "@ordo-pink/oath"
import { RRR } from "@ordo-pink/data"
import { Result } from "@ordo-pink/result"
import { type TLogger } from "@ordo-pink/logger"

type TInitUserStreamParams = (params: {
	hosts: THosts
	fetch: TFetch
	logger: TLogger
	is_dev: boolean
}) => { auth$: Observable<TOption<AuthResponse>>; get_is_authenticated: TGetIsAuthenticatedFn }
export const __init_auth$: TInitUserStreamParams = call_once(({ hosts, fetch, logger, is_dev }) => {
	const refresh_token = Oath.Empty()
		.pipe(Oath.ops.tap(() => logger.debug("Refreshing auth token...")))
		.pipe(Oath.ops.chain(() => Oath.Try(() => fetch(`${hosts.id}/refresh-token`, get_req_init()))))
		.pipe(Oath.ops.chain(response => Oath.Try(() => response.json())))
		.pipe(Oath.ops.chain(res => Oath.If(res.success, { T: () => res.result, F: () => res.error })))
		.pipe(Oath.ops.tap(() => logger.debug("Auth token refreshed.")))
		.pipe(Oath.ops.map(auth => auth$.next(auth)))

	const invoker = Oath.invokers.or_else(sign_out(logger, hosts.website, is_dev))

	logger.debug("Initialising auth...")

	void refresh_token.invoke(invoker)

	const interval = setInterval(() => void refresh_token.invoke(invoker), 50_000) // TODO: Move ms to ENV

	const drop_interval = () => {
		clearInterval(interval)
		window.removeEventListener("beforeunload", drop_interval)
	}

	window.addEventListener("beforeunload", drop_interval)

	logger.debug("Initialised auth.")

	return { auth$: auth$.pipe(map(value => value)), get_is_authenticated: _get_is_authenticated }
})

// --- Internal ---

const LOCATION = "__init_auth$"

const eperm = RRR.codes.eperm(LOCATION)

const _get_is_authenticated: TGetIsAuthenticatedFn = (fid: symbol | null) =>
	Result.If(KnownFunctions.check_permissions(fid, { queries: ["auth.is-authenticated"] }))
		.pipe(Result.ops.chain(() => Result.FromOption(auth$.getValue())))
		.pipe(Result.ops.bimap(() => eperm(`get_is_authenticated -> fid: ${String(fid)}`), T))

const get_req_init = (): RequestInit => ({ method: "POST", credentials: "include" })

const sign_out =
	(logger: TLogger, web_host: string, is_dev: boolean) => (res: string | Error | null) => {
		// Treat an error caused by HMR in dev mode when commands do not get restarted
		if (res instanceof Error && res.message === "Forbidden" && is_dev) {
			return window.location.reload()
		}

		logger.error("Token refresh failed. Signing out.")
		window.location.href = `${web_host}/sign-out`
	}

const auth$ = new BehaviorSubject<TOption<AuthResponse>>(O.None())
