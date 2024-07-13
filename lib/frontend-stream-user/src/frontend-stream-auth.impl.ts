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

import { F, N, T, call_once } from "@ordo-pink/tau"
import { Oath, if_else_oath } from "@ordo-pink/oath"
import { type TFetch, type THosts } from "@ordo-pink/core"
import { type AuthResponse } from "@ordo-pink/backend-server-id"
import { KnownFunctions } from "@ordo-pink/frontend-known-functions"
import { Result } from "@ordo-pink/result"
import { type TLogger } from "@ordo-pink/logger"

type TInitUserStreamParams = (params: {
	hosts: THosts
	fetch: TFetch
	logger: TLogger
	is_dev: boolean
}) => { auth$: Observable<AuthResponse | null> }
export const __init_auth$: TInitUserStreamParams = call_once(({ hosts, fetch, logger, is_dev }) => {
	const refresh_token = Oath.FromNullable(fetch)
		.pipe(Oath.ops.tap(log_token_refresh_start(logger)))
		.pipe(Oath.ops.chain(fetch_refresh_token0(fetch, hosts.id)))
		.pipe(Oath.ops.chain(get_json_response0))
		.pipe(Oath.ops.chain(check_fetch_succeeded0))
		.pipe(Oath.ops.map(update_auth(logger)))

	logger.debug("Initialising auth...")

	void refresh_token.invoke(Oath.invokers.or_else(sign_out(logger, hosts.website, is_dev)))

	const interval = setInterval(
		() => void refresh_token.invoke(Oath.invokers.or_else(sign_out(logger, hosts.website, is_dev))),
		50_000,
	) // TODO: Move to ENV
	const drop_interval = () => {
		clearInterval(interval)
		window.removeEventListener("beforeunload", drop_interval)
	}

	window.addEventListener("beforeunload", drop_interval)

	logger.debug("Initialised auth.")

	return { auth$: auth$.pipe(map(value => value)) }
})

export const _get_is_authenticated = (fid: symbol | null) =>
	Result.If(KnownFunctions.checkPermissions(fid, { queries: ["auth.is-authenticated"] }))
		.pipe(Result.ops.chain(() => Result.FromNullable(auth$.value?.sub)))
		.cata({ Ok: T, Err: F })

// TODO: Remove
export const _get_current_user_token = (fid: symbol | null) =>
	Result.If(KnownFunctions.checkPermissions(fid, { queries: [] }))
		.pipe(Result.ops.chain(() => Result.FromNullable(auth$.value?.accessToken)))
		.cata({ Ok: x => x, Err: N })

const log_token_refresh_start = (logger: TLogger) => () => logger.debug("Refreshing auth token...")

const fetch_refresh_token0 = (fetch: typeof window.fetch, id_host: string) => () =>
	Oath.Try(() => fetch(`${id_host}/refresh-token`, { method: "POST", credentials: "include" }))

const get_json_response0 = (res: Response) => Oath.FromPromise(res.json.bind(res))

const check_fetch_succeeded0 = if_else_oath<
	{ success: boolean; result: AuthResponse; error: string },
	AuthResponse,
	string
>(res => res.success, { on_true: res => res.result, on_false: res => res.error })

const update_auth = (logger: TLogger) => (auth: AuthResponse) => {
	logger.debug("Auth token refreshed.")
	return auth$.next(auth)
}

const sign_out =
	(logger: TLogger, web_host: string, is_dev: boolean) => (res: string | Error | null) => {
		// Treat an error caused by HMR in dev mode when commands do not get restarted
		if (res instanceof Error && res.message === "Forbidden" && is_dev) {
			return window.location.reload()
		}

		logger.error("Token refresh failed. Signing out.")
		window.location.href = `${web_host}/sign-out`
	}

// TODO: Do not export
export const auth$ = new BehaviorSubject<AuthResponse | null>(null)
