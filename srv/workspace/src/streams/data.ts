// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { cmd } from "@ordo-pink/frontend-core"
import { getCommands } from "./commands"
import { rrrToNotification } from "$utils/error-to-notification"
import { Hosts } from "$utils/hosts"
import { FSEntity } from "@ordo-pink/datautil/src/common"
import { Oath } from "@ordo-pink/oath"
import { BehaviorSubject, Observable } from "rxjs"
import { Logger } from "@ordo-pink/logger"
import { __Auth$ } from "./auth"
import { Unary } from "@ordo-pink/tau"
import { AuthResponse } from "@ordo-pink/backend-id-server"

const commands = getCommands()

export type __Metadata$ = Observable<FSEntity[]>
type Params = { logger: Logger; auth$: __Auth$ }
type Fn = Unary<Params, __Metadata$>
export const __initData: Fn = ({ logger, auth$ }) => {
	commands.on<cmd.data.directory.create>("data.create-directory", ({ payload }) => {
		const auth = (auth$ as BehaviorSubject<AuthResponse>).value

		Oath.fromNullable(auth)
			.chain(auth =>
				Oath.try(() =>
					fetch(`${Hosts.DATA}/directories/${auth.sub}`, {
						method: "POST",
						body: JSON.stringify(payload),
						headers: {
							"content-type": "application/json",
							authorization: `Bearer ${auth.accessToken}`,
						},
					}).then(res => res.json()),
				),
			)
			.chain(body => (body.success ? Oath.of(body.result) : Oath.reject(body.error as string)))
			.rejectedMap(rrrToNotification("Error creating directory"))
			.fork(
				item => {
					commands.emit<cmd.commandPalette.hide>("command-palette.hide")
					commands.emit<cmd.notification.show>("notification.show", item)
				},
				() => {
					commands.emit<cmd.commandPalette.hide>("command-palette.hide")
					commands.emit<cmd.data.refreshRoot>("data.refresh-root")
				},
			)
	})

	commands.emit<cmd.commandPalette.add>("command-palette.add", {
		id: "add-test-directory",
		readableName: "Add test directory",
		onSelect: () =>
			commands.emit<cmd.data.directory.create>("data.create-directory", { path: "/asdf/123/" }),
	})

	commands.on<cmd.data.refreshRoot>("data.refresh-root", () => {
		const auth = (auth$ as BehaviorSubject<AuthResponse>).value

		Oath.fromNullable(auth)
			.chain(auth =>
				Oath.try(() =>
					fetch(`${Hosts.DATA}/directories/${auth.sub}`, {
						headers: { Authorization: `Bearer ${auth.accessToken}` },
					}).then(res => res.json()),
				),
			)
			.chain(body => (body.success ? Oath.of(body.result) : Oath.reject(body.error as string)))
			.rejectedMap(rrrToNotification("Error fetching directories"))
			.map(body =>
				body.map((item: FSEntity) => ({
					...item,
					updatedAt: new Date(body.updatedAt),
					createdAt: new Date(body.createdAt),
				})),
			)
			.fork(
				item => commands.emit<cmd.notification.show>("notification.show", item),
				result => metadata$.next(result),
			)
	})

	return metadata$
}

const metadata$ = new BehaviorSubject<FSEntity[]>([])
