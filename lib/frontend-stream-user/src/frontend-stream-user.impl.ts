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

import { BehaviorSubject, Observable } from "rxjs"

import {
	CurrentUserManager,
	CurrentUserRepository,
	KnownUserRepository,
	RemoteCurrentUserRepository,
	type TUserQuery,
	UserQuery,
} from "@ordo-pink/data"
import { O, TOption } from "@ordo-pink/option"
import { type TFetch, type THosts } from "@ordo-pink/core"
import { call_once, noop } from "@ordo-pink/tau"
import { type AuthResponse } from "@ordo-pink/backend-server-id"
import { Switch } from "@ordo-pink/switch"
import { type TLogger } from "@ordo-pink/logger"

type TInitUserStreamFn = (params: {
	auth$: Observable<TOption<AuthResponse>>
	commands: Client.Commands.Commands
	hosts: THosts
	fetch: TFetch
	logger: TLogger
}) => { user_query: TUserQuery } // TODO: user_command
export const init_user: TInitUserStreamFn = call_once(
	({ auth$, commands, fetch, hosts, logger }) => {
		logger.debug("Initialising user...")
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

		logger.debug("Initialised user.")

		return { user_query }
	},
)

// --- Internal ---

const current_user$ = new BehaviorSubject<TOption<User.User>>(O.None())
const known_users$ = new BehaviorSubject<User.PublicUser[]>([])

// const unsubscribe_thunk = (subscription: Subscription) => () => subscription.unsubscribe()
// const unsubscribe = (subscription: Subscription) =>
// 	[unsubscribe_thunk(subscription), unsubscribe_thunk(subscription)] as const
// const req_init = (token: string) => ({ headers: { Authorization: `Bearer ${token}` } })
