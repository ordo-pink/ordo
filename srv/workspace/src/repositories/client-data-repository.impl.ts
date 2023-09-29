// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { rrrToNotification } from "$utils/error-to-notification"
import { Hosts } from "$utils/hosts"
import { AuthResponse } from "@ordo-pink/backend-id-server"
import { Data, DataRepository, PlainData } from "@ordo-pink/data"
import { Commands, cmd } from "@ordo-pink/frontend-core"
import { Oath } from "@ordo-pink/oath"
import { BehaviorSubject } from "rxjs"

const of = (
	data$: BehaviorSubject<PlainData[]>,
	auth$: BehaviorSubject<AuthResponse>,
	commands: Commands.Commands,
): DataRepository => ({
	create: plain => {
		const data = data$.value
		const auth = auth$.value

		if (!data) return Oath.reject(Data.Errors.DataNotFound)

		data$.next([...data, plain])

		Oath.fromNullable(auth)
			.chain(auth =>
				Oath.try(() =>
					fetch(`${Hosts.DATA}/${auth.sub}`, {
						method: "POST",
						body: JSON.stringify(plain),
						headers: {
							"content-type": "application/json",
							authorization: `Bearer ${auth.accessToken}`,
						},
					}).then(res => res.json()),
				),
			)
			.chain(body => (body.success ? Oath.of(body.result) : Oath.reject(body.error as string)))
			.rejectedMap(rrrToNotification("Error creating file"))
			.fork(
				item => {
					commands.emit<cmd.notification.show>("notification.show", item)
				},
				() => {
					// commands.emit<cmd.data.refreshRoot>("data.refresh-root")
				},
			)

		return Oath.of(plain)
	},
	delete: (_, fsid) => {
		const data = data$.value
		const auth = auth$.value

		if (!data) return Oath.of("OK")

		Oath.fromNullable(auth)
			.chain(auth =>
				Oath.try(() =>
					fetch(`${Hosts.DATA}/${auth.sub}/${fsid}`, {
						method: "DELETE",
						headers: {
							"content-type": "application/json",
							authorization: `Bearer ${auth.accessToken}`,
						},
					}).then(res => res.json()),
				),
			)
			.chain(body => (body.success ? Oath.of(body.result) : Oath.reject(body.error as string)))
			.rejectedMap(rrrToNotification("Error removing file"))
			.fork(
				item => {
					commands.emit<cmd.notification.show>("notification.show", item)
				},
				() => {
					// commands.emit<cmd.data.refreshRoot>("data.refresh-root")
				},
			)

		data$.next(data.filter(item => item.fsid !== fsid))

		return Oath.of("OK")
	},
	exists: (_, fsid) => {
		const data = data$.value

		if (!data) return Oath.of(false)

		return Oath.of(data.some(item => item.fsid === fsid))
	},
	find: (_, name, parent) => {
		const data = data$.value

		if (!data) return Oath.reject(Data.Errors.DataNotFound)

		return Oath.of(data.find(item => item.name === name && item.parent === parent))
			.chain(Oath.fromNullable)
			.rejectedMap(() => Data.Errors.DataNotFound)
	},
	get: (_, fsid) => {
		const data = data$.value

		if (!data) return Oath.reject(Data.Errors.DataNotFound)

		return Oath.of(data.find(item => item.fsid === fsid))
			.chain(Oath.fromNullable)
			.rejectedMap(() => Data.Errors.DataNotFound)
	},
	getAll: () => {
		const auth = auth$.value

		return Oath.fromNullable(auth)
			.chain(auth =>
				Oath.try(() =>
					fetch(`${Hosts.DATA}`, {
						headers: { Authorization: `Bearer ${auth.accessToken}` },
					}).then(res => res.json()),
				),
			)
			.chain(body => (body.success ? Oath.of(body.result) : Oath.reject(body.error as string)))
			.rejectedMap(() => Data.Errors.DataNotFound)
			.tap(
				// item => commands.emit<cmd.notification.show>("notification.show", item),
				result => data$.next(result),
			)
	},
	update: plain => {
		const data = data$.value
		const auth = auth$.value

		if (!data) return Oath.reject(Data.Errors.DataNotFound)

		const updatedItem = data.findIndex(item => item.fsid === plain.fsid)

		if (updatedItem < 0) return Oath.reject(Data.Errors.DataNotFound)

		const dataCopy = [...data]

		dataCopy.splice(updatedItem, 1, plain)

		data$.next(dataCopy)

		Oath.fromNullable(auth)
			.chain(auth =>
				Oath.try(() =>
					fetch(`${Hosts.DATA}/${auth.sub}/${plain.fsid}`, {
						method: "PUT",
						body: JSON.stringify(plain),
						headers: {
							"content-type": "application/json",
							authorization: `Bearer ${auth.accessToken}`,
						},
					}).then(res => res.json()),
				),
			)
			.chain(body => (body.success ? Oath.of(body.result) : Oath.reject(body.error as string)))
			.rejectedMap(rrrToNotification("Error creating file"))
			.fork(
				item => {
					commands.emit<cmd.notification.show>("notification.show", item)
				},
				() => {
					// commands.emit<cmd.data.refreshRoot>("data.refresh-root")
				},
			)

		return Oath.of("OK")
	},
})

export const ClientDataRepository = { of }
