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
import { RRR, type TRrr } from "@ordo-pink/data"
import { Result, type TResult } from "@ordo-pink/result"
import { type TFetch, type TGetIsAuthenticatedFn, type THosts } from "@ordo-pink/core"
import { type AuthResponse } from "@ordo-pink/backend-server-id"
import { KnownFunctions } from "@ordo-pink/frontend-known-functions"
import { Oath } from "@ordo-pink/oath"
import { type TLogger } from "@ordo-pink/logger"
import { call_once } from "@ordo-pink/tau"

type TInitAuthParams = (params: {
	hosts: THosts
	fetch: TFetch
	logger: TLogger
	commands: Client.Commands.Commands
}) => {
	get_auth: (fid: symbol | null) => () => TResult<Observable<TOption<AuthResponse>>, TRrr<"EPERM">>
	get_is_authenticated: TGetIsAuthenticatedFn
}
export const init_auth: TInitAuthParams = call_once(({ hosts, fetch, logger, commands }) => {
	// TODO: Move to auth fn
	const path: Routes.ID.RefreshToken.Path = "/account/refresh-token"
	const method: Routes.ID.RefreshToken.Method = "POST"

	const refresh_token = Oath.Empty()
		.pipe(
			Oath.ops.tap(() => {
				logger.debug("Refreshing auth token...")
				commands.emit<cmd.application.background_task.start_loading>(
					"application.background_task.start_loading",
				)
			}),
		)
		.pipe(
			Oath.ops.chain(() =>
				Oath.Try(
					() => fetch(hosts.id.concat(path), { method, credentials: "include" }),
					error => einval(`refresh_token -> error: ${String(error)}`),
				),
			),
		)
		.pipe(
			Oath.ops.chain(response =>
				Oath.Try(
					() => response.json(),
					error => einval(`refresh_token -> error: ${String(error)}`),
				),
			),
		)
		.pipe(Oath.ops.chain(res => Oath.If(res.success, { T: () => res.result, F: () => res.error })))
		.pipe(Oath.ops.tap(() => logger.debug("Auth token refreshed.")))
		.pipe(
			Oath.ops.map(auth => {
				commands.emit<cmd.application.background_task.reset_status>(
					"application.background_task.reset_status",
				)
				auth$.next(O.Some(auth))
			}),
		)

	const invoker = Oath.invokers.or_else(() => {
		commands.emit<cmd.application.background_task.reset_status>(
			"application.background_task.reset_status",
		)
		auth$.next(O.None())
		drop_interval()
	})

	logger.debug("Initialising auth...")

	void refresh_token.invoke(invoker)

	const interval = setInterval(() => void refresh_token.invoke(invoker), 50_000) // TODO: Move ms to ENV

	const drop_interval = () => {
		clearInterval(interval)
		window.removeEventListener("beforeunload", drop_interval)
	}

	window.addEventListener("beforeunload", drop_interval)

	logger.debug("Initialised auth.")

	return {
		get_auth: (fid: symbol | null) => () =>
			Result.If(KnownFunctions.check_is_internal(fid))
				.pipe(Result.ops.map(() => auth$.asObservable()))
				.pipe(Result.ops.err_map(() => eperm(`get_auth -> fid: ${String(fid)}`))),
		get_is_authenticated: (fid: symbol | null) => () =>
			Result.If(
				KnownFunctions.check_permissions(fid, { queries: ["users.current_user.is_authenticated"] }),
			)
				.pipe(Result.ops.map(() => auth$.pipe(map(option => option.is_some))))
				.pipe(Result.ops.err_map(() => eperm(`get_is_authenticated -> fid: ${String(fid)}`))),
	}
})

// --- Internal ---

const LOCATION = "init_auth"

const eperm = RRR.codes.eperm(LOCATION)
const einval = RRR.codes.einval(LOCATION)

// const sign_out =
// 	(logger: TLogger, web_host: string, is_dev: boolean) => (res: string | Error | null) => {
// Treat an error caused by HMR in dev mode when commands do not get restarted
// if (res instanceof Error && res.message === "Forbidden" && is_dev) {
// 	return window.location.reload()
// }
// logger.error("Token refresh failed. Signing out.")
// window.location.href = `${web_host}/sign-out`
// 	}

const auth$ = new BehaviorSubject<TOption<AuthResponse>>(O.None())
