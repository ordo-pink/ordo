// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

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
