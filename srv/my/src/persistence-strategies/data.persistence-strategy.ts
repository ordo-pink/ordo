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

import { Data, DataCreateErrors, DataPersistenceStrategy, PlainData } from "@ordo-pink/data"
import { BackgroundTaskStatus } from "@ordo-pink/core"
import { Oath } from "@ordo-pink/oath"
import { auth$ } from "@ordo-pink/frontend-stream-user"
import { data$ } from "@ordo-pink/frontend-stream-data"
import { _get_commands } from "@ordo-pink/frontend-stream-commands"
import { get_fetch } from "@ordo-pink/frontend-fetch"
import { get_hosts_unsafe } from "@ordo-pink/frontend-react-hooks"

const of = (fid: symbol): DataPersistenceStrategy => ({
	count: () =>
		Oath.fromNullable(data$.value)
			.map(data => data.length)
			.fix(() => 0),
	create: plain => {
		const commands = _get_commands(fid)
		const hosts = get_hosts_unsafe()
		const fetch = get_fetch(fid)
		const data = data$.value
		const auth = auth$.value

		if (!data) return Oath.Reject(Data.Errors.DataNotFound as DataCreateErrors)

		commands.emit<cmd.application.background_task.set_status>(
			"application.background_task.set_status",
			BackgroundTaskStatus.SAVING,
		)

		data$.next([...data, plain])

		void Oath.fromNullable(auth)
			.chain(auth =>
				Oath.try(() =>
					fetch(`${hosts.dt_host}/${auth.sub}`, {
						method: "POST",
						body: JSON.stringify(plain),
						headers: {
							"content-type": "application/json",
							authorization: `Bearer ${auth.accessToken}`,
						},
					}).then(res => res.json()),
				),
			)
			.chain(body => (body.success ? Oath.of(body.result) : Oath.Reject(body.error as string)))
			.fork(
				error => {
					commands.emit<cmd.notification.show>("notification.show", {
						title: "Ошибка",
						message: error instanceof Error ? error.message : error ?? "Не удалось создать файл.",
						type: "rrr",
					})
					commands.emit<cmd.application.background_task.reset_status>(
						"application.background_task.reset_status",
					)
					return data$.next(data)
				},
				() => {
					commands.emit<cmd.application.background_task.reset_status>(
						"application.background_task.reset_status",
					)
				},
			)

		return Oath.of(plain)
	},
	delete: (_, fsid) => {
		const commands = _get_commands(fid)
		const hosts = get_hosts_unsafe()
		const fetch = get_fetch(fid)
		const data = data$.value
		const auth = auth$.value

		if (!data) return Oath.of("OK")

		commands.emit<cmd.application.background_task.set_status>(
			"application.background_task.set_status",
			BackgroundTaskStatus.SAVING,
		)

		void Oath.fromNullable(auth)
			.chain(auth =>
				Oath.try(() =>
					fetch(`${hosts.dt_host}/${auth.sub}/${fsid}`, {
						method: "DELETE",
						headers: {
							"content-type": "application/json",
							authorization: `Bearer ${auth.accessToken}`,
						},
					}).then(res => res.json()),
				),
			)
			.chain(body => (body.success ? Oath.of(body.result) : Oath.Reject(body.error as string)))
			.fork(
				error => {
					commands.emit<cmd.notification.show>("notification.show", {
						title: "Ошибка",
						message: error instanceof Error ? error.message : error ?? "Не удалось удалить данные.",
						type: "rrr",
					})
					commands.emit<cmd.application.background_task.reset_status>(
						"application.background_task.reset_status",
					)
				},
				() => {
					commands.emit<cmd.application.background_task.reset_status>(
						"application.background_task.reset_status",
					)
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

		if (!data) return Oath.Reject(Data.Errors.DataNotFound)

		return Oath.of(data.find(item => item.name === name && item.parent === parent))
			.chain(Oath.fromNullable)
			.rejectedMap(() => Data.Errors.DataNotFound)
	},
	get: (_, fsid) => {
		const data = data$.value

		if (!data) return Oath.Reject(Data.Errors.DataNotFound)

		return Oath.of(data.find(item => item.fsid === fsid))
			.chain(Oath.fromNullable)
			.rejectedMap(() => Data.Errors.DataNotFound)
	},
	getAll: () => {
		const commands = _get_commands(fid)
		const hosts = get_hosts_unsafe()
		const fetch = get_fetch(fid)
		const auth = auth$.value

		commands.emit<cmd.application.background_task.set_status>(
			"application.background_task.set_status",
			BackgroundTaskStatus.LOADING,
		)

		return Oath.fromNullable(auth)
			.chain(auth =>
				Oath.try(() =>
					fetch(`${hosts.dt_host}`, {
						headers: { Authorization: `Bearer ${auth.accessToken}` },
					}).then(res => res.json()),
				),
			)
			.chain(body =>
				body.success ? Oath.of(body.result as PlainData[]) : Oath.Reject(body.error as string),
			)
			.rejectedMap(() => Data.Errors.DataNotFound)
			.bitap(
				() => {
					commands.emit<cmd.application.background_task.reset_status>(
						"application.background_task.reset_status",
					)
				},
				result => {
					commands.emit<cmd.application.background_task.reset_status>(
						"application.background_task.reset_status",
					)
					data$.next(result)
				},
			)
	},
	update: plain => {
		const commands = _get_commands(fid)
		const hosts = get_hosts_unsafe()
		const fetch = get_fetch(fid)
		const data = data$.value
		const auth = auth$.value

		if (!data) return Oath.Reject(Data.Errors.DataNotFound)

		commands.emit<cmd.application.background_task.set_status>(
			"application.background_task.set_status",
			BackgroundTaskStatus.SAVING,
		)

		const updatedItem = data.findIndex(item => item.fsid === plain.fsid)

		if (updatedItem < 0) return Oath.Reject(Data.Errors.DataNotFound)

		const dataCopy = [...data]

		dataCopy.splice(updatedItem, 1, plain)

		data$.next(dataCopy)

		void Oath.fromNullable(auth)
			.chain(auth =>
				Oath.try(() =>
					fetch(`${hosts.dt_host}/${auth.sub}/${plain.fsid}`, {
						method: "PUT",
						body: JSON.stringify(plain),
						headers: {
							"content-type": "application/json",
							authorization: `Bearer ${auth.accessToken}`,
						},
					}).then(res => res.json()),
				),
			)
			.chain(body => (body.success ? Oath.of(body.result) : Oath.Reject(body.error as string)))
			.fork(
				() => {
					data$.next(data)
					commands.emit<cmd.application.background_task.reset_status>(
						"application.background_task.reset_status",
					)
					// commands.emit<cmd.notification.show>("notification.show", item)
				},
				() => {
					commands.emit<cmd.application.background_task.reset_status>(
						"application.background_task.reset_status",
					)
				},
			)

		return Oath.of("OK")
	},
})

export const ClientDataPersistenceStrategy = { of }
