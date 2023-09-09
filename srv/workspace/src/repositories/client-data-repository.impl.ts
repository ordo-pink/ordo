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
	metadata$: BehaviorSubject<PlainData[]>,
	auth$: BehaviorSubject<AuthResponse>,
	commands: Commands.Commands,
): DataRepository => ({
	create: plain => {
		const metadata = metadata$.value
		const auth = auth$.value

		if (!metadata) return Oath.reject(Data.Errors.DataNotFound)

		metadata$.next([...metadata, plain])

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
		const metadata = metadata$.value
		const auth = auth$.value

		if (!metadata) return Oath.of("OK")

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

		metadata$.next(metadata.filter(item => item.fsid !== fsid))

		return Oath.of("OK")
	},
	exists: (_, fsid) => {
		const metadata = metadata$.value

		if (!metadata) return Oath.of(false)

		return Oath.of(metadata.some(item => item.fsid === fsid))
	},
	find: (_, name, parent) => {
		const metadata = metadata$.value

		if (!metadata) return Oath.reject(Data.Errors.DataNotFound)

		return Oath.of(metadata.find(item => item.name === name && item.parent === parent))
			.chain(Oath.fromNullable)
			.rejectedMap(() => Data.Errors.DataNotFound)
	},
	get: (_, fsid) => {
		const metadata = metadata$.value

		if (!metadata) return Oath.reject(Data.Errors.DataNotFound)

		return Oath.of(metadata.find(item => item.fsid === fsid))
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
				result => metadata$.next(result),
			)
	},
	update: plain => {
		const metadata = metadata$.value
		const auth = auth$.value

		if (!metadata) return Oath.reject(Data.Errors.DataNotFound)

		const updatedItem = metadata.findIndex(item => item.fsid === plain.fsid)

		if (updatedItem < 0) return Oath.reject(Data.Errors.DataNotFound)

		const metadataCopy = [...metadata]

		metadataCopy.splice(updatedItem, 1, plain)

		metadata$.next(metadataCopy)

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
