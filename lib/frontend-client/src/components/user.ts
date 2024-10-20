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
	CurrentUserRepository,
	CurrentUserRepositoryAsync,
	PublicUserRepository,
	RRR,
	UserQuery,
} from "@ordo-pink/core"
import { O, type TOption } from "@ordo-pink/option"
import { invokers0, Oath, ops0 } from "@ordo-pink/oath"
import { call_once, noop } from "@ordo-pink/tau"
import { type AuthResponse } from "@ordo-pink/backend-server-id"
import { CurrentUserManager } from "@ordo-pink/managers"
import { Result } from "@ordo-pink/result"
import { Switch } from "@ordo-pink/switch"

import { type TInitCtx } from "../frontend-client.types"

type TInitUserParams = (
	params: Pick<TInitCtx, "hosts" | "fetch" | "logger" | "commands" | "known_functions">,
) => {
	get_is_authenticated: (fid: symbol) => Ordo.CreateFunction.GetIsAuthenticatedFn
	get_user_query: (fid: symbol) => Ordo.CreateFunction.GetUserQueryFn
	user_query: Ordo.User.Query
	auth$: Observable<TOption<AuthResponse>>
}
export const init_user: TInitUserParams = call_once(
	({ hosts, fetch, logger, commands, known_functions }) => {
		logger.debug("Initialising auth...")

		let timeout: number

		// TODO: Move to auth fn
		const path: Ordo.Routes.ID.RefreshToken.Path = "/account/refresh-token"
		const method: Ordo.Routes.ID.RefreshToken.Method = "POST"

		const refresh_token = Oath.Resolve({ path, method })
			.pipe(
				ops0.tap(() => {
					logger.debug("Refreshing auth token...")
					commands.emit("cmd.application.background_task.start_loading")
				}),
			)
			.pipe(
				ops0.chain(({ path, method }) =>
					Oath.Try(() => fetch(hosts.id.concat(path), { method, credentials: "include" }))
						.pipe(ops0.chain(response => Oath.Try(() => response.json())))
						.pipe(ops0.rejected_map(e => einval(`refresh_token -> error: ${String(e)}`))),
				),
			)
			.pipe(ops0.chain(res => Oath.If(res.success, { T: () => res.result, F: () => res.error })))
			.pipe(ops0.tap(() => logger.debug("Auth token refreshed.")))
			.pipe(
				ops0.map(auth => {
					commands.emit("cmd.application.background_task.reset_status")

					auth$.next(O.Some(auth))

					create_timeout()
				}),
			)

		const or_cancel_state_changes = invokers0.or_else(() => {
			commands.emit("cmd.application.background_task.reset_status")
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
				50_000, // TODO: Move ms to ENV
			) as unknown as number
		}

		const drop_timeout = () => {
			logger.debug("Clearing next refresh token tick...")

			clearTimeout(timeout)
			window.removeEventListener("beforeunload", drop_timeout)
		}

		logger.debug("Initialised auth.")

		const current_user_repository = CurrentUserRepository.Of(current_user$)
		const current_user_remote_repository = CurrentUserRepositoryAsync.Of(hosts.id, fetch)

		const known_users_repository = PublicUserRepository.Of(known_users$)

		const user_query = UserQuery.Of(current_user_repository, known_users_repository)

		CurrentUserManager.of(current_user_repository, current_user_remote_repository, auth$).start(
			state_change =>
				Switch.Match(state_change)
					.case("get-remote", () => commands.emit("cmd.application.background_task.start_loading"))
					.case("put-remote", () => commands.emit("cmd.application.background_task.start_saving"))
					.case(["get-remote-complete", "put-remote-complete"], () =>
						commands.emit("cmd.application.background_task.reset_status"),
					)
					.default(noop),
		)

		// TODO: Move to user_command
		// commands.on<cmd.user.refresh_info>("user.refresh", () => {
		// 	const subscription = auth$.subscribe(auth => {
		// 		void Oath.If(auth.is_some)
		// 			.pipe(ops0.map(() => auth))
		// 			.pipe(ops0.chain(auth => Oath.FromNullable(auth.unwrap()!.accessToken)))
		// 			.pipe(ops0.chain(at => Oath.Try(() => fetch(`${hosts.id}/account`, req_init(at)))))
		// 			.pipe(ops0.chain(response => Oath.FromPromise(() => response.json())))
		// 			.pipe(ops0.chain(r => Oath.If(r.success, { T: () => r.result, F: () => r.error })))
		// 			.pipe(ops0.map(user => current_user$.next(O.Some(user))))
		// 			.pipe(ops0.bitap(...unsubscribe(subscription)))
		// 			.invoke(
		// 				// TODO: Better error handling
		// 				invokers0.or_else(error =>
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

			get_user_query: fid => () =>
				Result.If(known_functions.has_permissions(fid, { queries: ["users.users_query"] }))
					.pipe(Result.ops.err_map(() => eperm(`get_user_query -> fid: ${String(fid)}`)))
					.pipe(Result.ops.map(() => user_query)),

			get_is_authenticated: (fid: symbol | null) => () =>
				Result.If(
					known_functions.has_permissions(fid, {
						queries: ["users.current_user.is_authenticated"],
					}),
				)
					.pipe(Result.ops.map(() => auth$.pipe(map(option => option.is_some))))
					.pipe(Result.ops.err_map(() => eperm(`get_is_authenticated -> fid: ${String(fid)}`))),
		}
	},
)

// --- Internal ---

const LOCATION = "init_auth"

const eperm = RRR.codes.eperm(LOCATION)
const einval = RRR.codes.einval(LOCATION)

const auth$ = new BehaviorSubject<TOption<AuthResponse>>(O.None())
const current_user$ = new BehaviorSubject<TOption<Ordo.User.Current.Instance>>(O.None())
const known_users$ = new BehaviorSubject<Ordo.User.Public.Instance[]>([])
