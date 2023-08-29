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

const commands = getCommands()

export type __Metadata$ = Observable<FSEntity[]>
type Params = { logger: Logger; auth$: __Auth$ }
type Fn = Unary<Params, __Metadata$>
export const __initData: Fn = ({ logger, auth$ }) => {
	commands.on<cmd.data.refreshRoot>("data.refresh-root", () => {
		const subscription = auth$.subscribe(auth => {
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
				.tap(() => subscription.unsubscribe())
				.fork(
					item => commands.emit<cmd.notification.show>("notification.show", item),
					result => metadata$.next(result),
				)
		})
	})

	return metadata$
}

const metadata$ = new BehaviorSubject<FSEntity[]>([])
