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

import {
	CurrentUserManager,
	CurrentUserRepository,
	KnownUserRepository,
	RRR,
	RemoteCurrentUserRepository,
	type TRrr,
	type TUserQuery,
	UserQuery,
} from "@ordo-pink/data"
import { O, type TOption } from "@ordo-pink/option"
import { Result, type TResult } from "@ordo-pink/result"
import { type TFetch, type TGetIsAuthenticatedFn, type THosts } from "@ordo-pink/core"
import { call_once, noop } from "@ordo-pink/tau"
import { type AuthResponse } from "@ordo-pink/backend-server-id"
import { KnownFunctions } from "@ordo-pink/frontend-known-functions"
import { Oath } from "@ordo-pink/oath"
import { Switch } from "@ordo-pink/switch"
import { type TLogger } from "@ordo-pink/logger"

type TInitUserParams = (params: {
	hosts: THosts
	fetch: TFetch
	logger: TLogger
	commands: Client.Commands.Commands
}) => {
	get_auth: (fid: symbol | null) => () => TResult<Observable<TOption<AuthResponse>>, TRrr<"EPERM">>
	get_is_authenticated: TGetIsAuthenticatedFn
	user_query: TUserQuery
	auth$: Observable<TOption<AuthResponse>>
}
export const init_user: TInitUserParams = call_once(({ hosts, fetch, logger, commands }) => {
	logger.debug("Initialising auth...")

	let timeout: number

	// TODO: Move to auth fn
	const path: Routes.ID.RefreshToken.Path = "/account/refresh-token"
	const method: Routes.ID.RefreshToken.Method = "POST"

	const refresh_token = Oath.Resolve({ path, method })
		.pipe(
			Oath.ops.tap(() => {
				logger.debug("Refreshing auth token...")
				commands.emit<cmd.application.background_task.start_loading>(
					"application.background_task.start_loading",
				)
			}),
		)
		.pipe(
			Oath.ops.chain(({ path, method }) =>
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

				create_timeout()
			}),
		)

	const or_cancel_state_changes = Oath.invokers.or_else(() => {
		commands.emit<cmd.application.background_task.reset_status>(
			"application.background_task.reset_status",
		)
		auth$.next(O.None())
		drop_timeout()
	})

	void refresh_token.invoke(or_cancel_state_changes)

	const create_timeout = () => {
		if (timeout) drop_timeout()

		logger.debug("Creating next refresh token tick...")

		window.addEventListener("beforeunload", drop_timeout)
		timeout = setTimeout(
			() => void refresh_token.invoke(or_cancel_state_changes),
			50_000,
		) as unknown as number // TODO: Move ms to ENV
	}

	const drop_timeout = () => {
		logger.debug("Clearing next refresh token tick...")

		clearTimeout(timeout)
		window.removeEventListener("beforeunload", drop_timeout)
	}

	logger.debug("Initialised auth.")

	const current_user_repository = CurrentUserRepository.of(current_user$)
	const current_user_remote_repository = RemoteCurrentUserRepository.of(hosts.id, fetch)

	const known_users_repository = KnownUserRepository.of(known_users$)

	const user_query = UserQuery.of(current_user_repository, known_users_repository)
	// TODO: const user_command = UserCommand.of(user_query, current_user_repository, known_users_repository)

	CurrentUserManager.of(current_user_repository, current_user_remote_repository, auth$).start(
		state_change =>
			Switch.Match(state_change)
				.case("get-remote", () =>
					commands.emit<cmd.application.background_task.start_loading>(
						"application.background_task.start_loading",
					),
				)
				.case("put-remote", () =>
					commands.emit<cmd.application.background_task.start_saving>(
						"application.background_task.start_saving",
					),
				)
				.case(["get-remote-complete", "put-remote-complete"], () =>
					commands.emit<cmd.application.background_task.reset_status>(
						"application.background_task.reset_status",
					),
				)
				.default(noop),
	)

	// TODO: Move to user_command
	// commands.on<cmd.user.refresh_info>("user.refresh", () => {
	// 	const subscription = auth$.subscribe(auth => {
	// 		void Oath.If(auth.is_some)
	// 			.pipe(Oath.ops.map(() => auth))
	// 			.pipe(Oath.ops.chain(auth => Oath.FromNullable(auth.unwrap()!.accessToken)))
	// 			.pipe(Oath.ops.chain(at => Oath.Try(() => fetch(`${hosts.id}/account`, req_init(at)))))
	// 			.pipe(Oath.ops.chain(response => Oath.FromPromise(() => response.json())))
	// 			.pipe(Oath.ops.chain(r => Oath.If(r.success, { T: () => r.result, F: () => r.error })))
	// 			.pipe(Oath.ops.map(user => current_user$.next(O.Some(user))))
	// 			.pipe(Oath.ops.bitap(...unsubscribe(subscription)))
	// 			.invoke(
	// 				// TODO: Better error handling
	// 				Oath.invokers.or_else(error =>
	// 					commands.emit<cmd.notification.show>("notification.show", {
	// 						type: "rrr",
	// 						title: "Ошибка получения данных о пользователе", // TODO: Move to i18n
	// 						message: error instanceof Error ? error.message : error ?? "Неизвестная ошибка", // TODO: Move to i18n
	// 					}),
	// 				),
	// 			)
	// 	})
	// })

	return {
		auth$,
		user_query,
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
const current_user$ = new BehaviorSubject<TOption<User.User>>(O.None())
const known_users$ = new BehaviorSubject<User.PublicUser[]>([])
