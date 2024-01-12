// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Hosts } from "$utils/hosts"
import { AuthResponse } from "@ordo-pink/backend-server-id"
import { ContentPersistenceStrategy, Data, UnexpectedError } from "@ordo-pink/data"
import { BackgroundTaskStatus, Commands } from "@ordo-pink/frontend-core"
import { Oath } from "@ordo-pink/oath"
import { BehaviorSubject } from "rxjs"

const of = (
	auth$: BehaviorSubject<AuthResponse>,
	commands: Commands.Commands,
): ContentPersistenceStrategy<any> => ({
	create: () => Oath.of("OK"),
	delete: () => Oath.of("OK"),
	read: (uid, fsid) =>
		Oath.fromNullable(auth$.value)
			.tap(() => {
				commands.emit<cmd.background.setStatus>(
					"background-task.set-status",
					BackgroundTaskStatus.LOADING,
				)
			})
			.rejectedMap(() => Data.Errors.DataNotFound)
			.chain(auth =>
				Oath.try(() =>
					fetch(`${Hosts.DATA}/${uid}/${fsid}`, {
						method: "GET",
						headers: {
							"content-type": "application/json",
							authorization: `Bearer ${auth.accessToken}`,
						},
					}).then(res => res.text()),
				).rejectedMap(UnexpectedError),
			)
			.bitap(
				() => commands.emit<cmd.background.resetStatus>("background-task.reset-status"),
				() => commands.emit<cmd.background.resetStatus>("background-task.reset-status"),
			),
	write: (uid, fsid, content) =>
		Oath.fromNullable(auth$.value)
			.tap(() => {
				commands.emit<cmd.background.setStatus>(
					"background-task.set-status",
					BackgroundTaskStatus.SAVING,
				)
			})
			.rejectedMap(() => UnexpectedError(new Error("Something went wrong")))
			.chain(auth =>
				Oath.try(() =>
					fetch(`${Hosts.DATA}/${uid}/${fsid}/update`, {
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
			),
})

export const ClientContentPersistenceStrategy = { of }
