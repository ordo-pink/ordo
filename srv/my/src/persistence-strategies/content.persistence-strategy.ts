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

import { ContentPersistenceStrategy, Data, UnexpectedError } from "@ordo-pink/data"
import { BackgroundTaskStatus } from "@ordo-pink/core"
import { Oath } from "@ordo-pink/oath"
import { auth$ } from "@ordo-pink/frontend-stream-user"
import { _get_commands } from "@ordo-pink/frontend-stream-commands"
import { get_fetch } from "@ordo-pink/frontend-fetch"
import { get_hosts_unsafe } from "@ordo-pink/frontend-react-hooks"

const of = (fid: symbol): ContentPersistenceStrategy<any> => ({
	create: () => Oath.of("OK"),
	delete: () => Oath.of("OK"),
	read: (uid, fsid) => {
		const commands = _get_commands(fid)
		const hosts = get_hosts_unsafe()
		const fetch = get_fetch(fid)

		return Oath.fromNullable(auth$.value)
			.tap(() => {
				commands.emit<cmd.application.background_task.set_status>(
					"application.background_task.set_status",
					BackgroundTaskStatus.LOADING,
				)
			})
			.rejectedMap(() => Data.Errors.DataNotFound)
			.chain(auth =>
				Oath.try(() =>
					fetch(`${hosts.dt_host}/${uid}/${fsid}`, {
						method: "GET",
						headers: {
							"content-type": "application/json",
							authorization: `Bearer ${auth.accessToken}`,
						},
					}).then(res =>
						res.status === 200 ? res.text() : res.json().then(res => Promise.reject(res.error)),
					),
				).rejectedMap(UnexpectedError),
			)
			.bitap(
				() =>
					commands.emit<cmd.application.background_task.reset_status>(
						"application.background_task.reset_status",
					),
				() =>
					commands.emit<cmd.application.background_task.reset_status>(
						"application.background_task.reset_status",
					),
			)
	},
	write: (uid, fsid, content) => {
		const commands = _get_commands(fid)
		const hosts = get_hosts_unsafe()
		const fetch = get_fetch(fid)

		return Oath.fromNullable(auth$.value)
			.tap(() => {
				commands.emit<cmd.application.background_task.set_status>(
					"application.background_task.set_status",
					BackgroundTaskStatus.SAVING,
				)
			})
			.rejectedMap(() => UnexpectedError(new Error("Something went wrong")))
			.chain(auth =>
				Oath.try(() =>
					fetch(`${hosts.dt_host}/${uid}/${fsid}/update`, {
						method: "PUT",
						headers: {
							authorization: `Bearer ${auth.accessToken}`,
						},
						body: content,
					})
						.then(res => res.json())
						.then(json => json.result),
				).rejectedMap(UnexpectedError),
			)
			.bitap(
				() =>
					commands.emit<cmd.application.background_task.reset_status>(
						"application.background_task.reset_status",
					),
				() =>
					commands.emit<cmd.application.background_task.reset_status>(
						"application.background_task.reset_status",
					),
			)
	},
})

export const ClientContentPersistenceStrategy = { of }
