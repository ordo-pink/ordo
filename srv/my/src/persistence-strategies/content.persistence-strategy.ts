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
import { getCommands } from "@ordo-pink/frontend-stream-commands"
import { getFetch } from "@ordo-pink/frontend-fetch"
import { getHosts } from "@ordo-pink/frontend-react-hooks"

const of = (fid: symbol): ContentPersistenceStrategy<any> => ({
	create: () => Oath.of("OK"),
	delete: () => Oath.of("OK"),
	read: (uid, fsid) => {
		const commands = getCommands(fid)
		const hosts = getHosts()
		const fetch = getFetch(fid)

		return Oath.fromNullable(auth$.value)
			.tap(() => {
				commands.emit<cmd.background.setStatus>(
					"background-task.set-status",
					BackgroundTaskStatus.LOADING,
				)
			})
			.rejectedMap(() => Data.Errors.DataNotFound)
			.chain(auth =>
				Oath.try(() =>
					fetch(`${hosts.dtHost}/${uid}/${fsid}`, {
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
				() => commands.emit<cmd.background.resetStatus>("background-task.reset-status"),
				() => commands.emit<cmd.background.resetStatus>("background-task.reset-status"),
			)
	},
	write: (uid, fsid, content) => {
		const commands = getCommands(fid)
		const hosts = getHosts()
		const fetch = getFetch(fid)

		return Oath.fromNullable(auth$.value)
			.tap(() => {
				commands.emit<cmd.background.setStatus>(
					"background-task.set-status",
					BackgroundTaskStatus.SAVING,
				)
			})
			.rejectedMap(() => UnexpectedError(new Error("Something went wrong")))
			.chain(auth =>
				Oath.try(() =>
					fetch(`${hosts.dtHost}/${uid}/${fsid}/update`, {
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
				() => commands.emit<cmd.background.resetStatus>("background-task.reset-status"),
				() => commands.emit<cmd.background.resetStatus>("background-task.reset-status"),
			)
	},
})

export const ClientContentPersistenceStrategy = { of }
