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

import { BehaviorSubject } from "rxjs/internal/BehaviorSubject"

import { Either } from "@ordo-pink/either"
import { KnownFunctions } from "@ordo-pink/frontend-known-functions"
import { Oath } from "@ordo-pink/oath"
import { callOnce } from "@ordo-pink/tau"
import { getCommands } from "@ordo-pink/frontend-stream-commands"
import { getCurrentUserToken } from "./frontend-stream-auth.impl"
import { getFetch } from "@ordo-pink/frontend-fetch"
import { getLogger } from "@ordo-pink/frontend-logger"

type InitUserParams = { fid: symbol; idHost: string }
export const __initUser$ = callOnce(({ fid, idHost }: InitUserParams) => {
	const commands = getCommands(fid)
	const fetch = getFetch(fid)
	const logger = getLogger(fid)

	logger.debug("Initialising user...")

	commands.on<cmd.user.refreshInfo>("user.refresh", () =>
		Oath.fromNullable(getCurrentUserToken(fid))
			.chain(token =>
				Oath.try(() =>
					fetch(`${idHost}/account`, { headers: { Authorization: `Bearer ${token}` } }),
				),
			)
			.chain(res => Oath.from(res.json.bind(res)))
			.chain(
				Oath.ifElse<{ success: boolean; result: User.User; error: string }, User.User, string>(
					res => res.success,
					{ onTrue: res => res.result, onFalse: res => res.error },
				),
			)
			.map(user => user$.next(user))
			.orElse(error =>
				commands.emit<cmd.notification.show>("notification.show", {
					type: "rrr",
					title: "Ошибка получения данных о пользователе", // TODO: Move to i18n
					message: error instanceof Error ? error.message : error ?? "Неизвестная ошибка", // TODO: Move to i18n
				}),
			),
	)

	logger.debug("Initialised user.")
})

export const getUser = (fid: symbol | null) =>
	Either.fromBoolean(() => KnownFunctions.checkPermissions(fid, { queries: [] })).fold(
		() => null,
		() => user$.value,
	)

export const user$ = new BehaviorSubject<User.User | null>(null)
