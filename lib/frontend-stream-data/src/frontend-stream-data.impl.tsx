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

import {
	BsArrowRightSquare,
	BsFileEarmark,
	BsLink,
	BsNodeMinus,
	BsNodePlus,
	BsPencilSquare,
	BsSlash,
	BsTag,
	BsTags,
} from "react-icons/bs"
import { F, T } from "ramda"
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject"
import { PiGraph } from "react-icons/pi"

import { Data, DataRepository, FSID, PlainData, TDataCommands } from "@ordo-pink/data"
import { Oath, chain_oath, from_nullable_oath, map_oath, or_else_oath } from "@ordo-pink/oath"
import { Either } from "@ordo-pink/either"
import { KnownFunctions } from "@ordo-pink/frontend-known-functions"
import { LIB_DIRECTORY_FSID } from "@ordo-pink/core"
import { N } from "@ordo-pink/tau"
import { auth$ } from "@ordo-pink/frontend-stream-user"
import { _get_commands } from "@ordo-pink/frontend-stream-commands"
import { get_fetch } from "@ordo-pink/frontend-fetch"
import { get_hosts_unsafe } from "@ordo-pink/frontend-react-hooks"
import { get_logger } from "@ordo-pink/frontend-logger"

import CreateFileModal from "./components/create-file-modal.component"
import RemoveFileModal from "./components/remove-file-modal.component"
import RenameModal from "./components/rename-modal.component"

type P = { fid: symbol; dataCommands: TDataCommands<string | ArrayBuffer> }
export const __initData = ({ fid, dataCommands }: P) => {
	const logger = get_logger(fid)
	const commands = _get_commands(fid)
	const hosts = get_hosts_unsafe()

	logger.debug("Initialising data...")

	commands.on<cmd.data.show_create_modal>("data.show-create-modal", payload => {
		commands.emit<cmd.modal.show>("modal.show", {
			Component: () => <CreateFileModal parent={payload} />,
		})
	})

	commands.on<cmd.data.show_edit_labels_palette>("data.show-edit-labels-palette", payload => {
		const data = DataRepository.dropHidden(data$.value ?? [])
		const labels = Array.from(new Set(data?.flatMap(item => item.labels) ?? []))
		const item = data?.find(item => item.fsid === payload.fsid)

		if (!item) return

		const handleShowEditLabels = () => {
			commands.emit<cmd.command_palette.show>("command-palette.show", {
				onNewItem: label => {
					commands.emit<cmd.data.add_labels>("data.metadata.add_label", { item, label })
					item.labels.push(label)
					handleShowEditLabels()
				},
				multiple: true,
				pinnedItems: item.labels.map(label => ({
					id: label,
					readableName: label,
					Icon: BsTag,
					onSelect: () => {
						commands.emit<cmd.data.metadata.remove_labels>("data.metadata.remove_label", {
							item,
							label,
						})
						item.labels.splice(item.labels.indexOf(label), 1)
						handleShowEditLabels()
					},
				})),
				items: labels
					.filter(label => !item.labels.includes(label))
					.map(label => ({
						id: label,
						readableName: label,
						Icon: BsTag,
						onSelect: () => {
							commands.emit<cmd.data.add_labels>("data.metadata.add_label", { item, label })
							item.labels.push(label)
							handleShowEditLabels()
						},
					})),
			})
		}

		handleShowEditLabels()
	})

	commands.on<cmd.data.show_edit_links_palette>("data.show-edit-links-palette", payload => {
		const data = DataRepository.dropHidden(data$.value ?? [])
		const links = Array.from(new Set(data?.map(item => item.fsid) ?? []))
		const item = data?.find(item => item.fsid === payload.fsid)

		if (!item) return

		const handleShowEditLinks = () => {
			commands.emit<cmd.command_palette.show>("command-palette.show", {
				multiple: true,
				pinnedItems: item.links.map(link => ({
					id: link,
					readableName: data.find(item => item.fsid === link)!.name,
					Icon: BsLink,
					onSelect: () => {
						commands.emit<cmd.data.metadata.remove_links>("data.metadata.remove_links", {
							item,
							link,
						})
						item.links.splice(item.links.indexOf(link), 1)
						handleShowEditLinks()
					},
				})),
				items: links
					.filter(link => !item.links.includes(link))
					.map(link => ({
						id: link,
						readableName: data.find(item => item.fsid === link)!.name,
						Icon: BsLink,
						onSelect: () => {
							commands.emit<cmd.data.add_links>("data.add_links", { item, link })
							item.links.push(link)
							handleShowEditLinks()
						},
					})),
			})
		}

		handleShowEditLinks()
	})

	commands.on<cmd.data.show_remove_modal>("data.show-remove-modal", payload => {
		commands.emit<cmd.modal.show>("modal.show", {
			Component: () => <RemoveFileModal data={payload} />,
		})
	})

	commands.on<cmd.data.show_rename_modal>("data.show-rename-modal", payload => {
		commands.emit<cmd.modal.show>("modal.show", {
			Component: () => <RenameModal data={payload} />,
		})
	})

	// commands.on<cmd.data.showUploadModal>("data.show-upload-modal", payload => {
	// 	commands.emit<cmd.modal.show>("modal.show", {
	// 		Component: () => <UploadFilesModal parent={payload} />,
	// 	})
	// })

	commands.on<cmd.data.create>("data.metadata.create", payload => {
		const auth = auth$.value
		const { name, parent, labels = [] } = payload

		if (!auth) return

		void dataCommands
			.create({ name, parent, createdBy: auth.sub, fileLimit: auth.fileLimit, labels })
			.orElse(message =>
				commands.emit<cmd.notification.show>("notification.show", {
					message,
					type: "rrr",
					title: "Error creating data",
				}),
			)
	})

	commands.on<cmd.data.metadata.remove>("data.metadata.remove", payload => {
		const auth = auth$.value
		if (!auth) return

		void dataCommands.remove({ fsid: payload.fsid, createdBy: auth.sub }).orNothing()
	})

	commands.on<cmd.data.metadata.rename>("data.metadata.rename", payload => {
		const auth = auth$.value
		if (!auth) return

		void dataCommands
			.rename({ fsid: payload.fsid, createdBy: auth.sub, name: payload.name, updatedBy: auth.sub })
			.orNothing()
	})

	commands.on<cmd.data.metadata.move>("data.metadata.move", payload => {
		const auth = auth$.value
		if (!auth) return

		void dataCommands
			.move({
				fsid: payload.fsid,
				createdBy: auth.sub,
				parent: payload.parent,
				updatedBy: auth.sub,
			})
			.orNothing()
	})

	commands.on<cmd.data.add_labels>("data.metadata.add_label", payload => {
		const auth = auth$.value
		if (!auth) return

		void dataCommands
			.addLabel({
				fsid: payload.item.fsid,
				createdBy: auth.sub,
				updatedBy: auth.sub,
				label: payload.label,
			})
			.orNothing()
	})

	commands.on<cmd.data.metadata.remove_labels>("data.metadata.remove_label", payload => {
		const auth = auth$.value
		if (!auth) return

		void dataCommands
			.removeLabel({
				fsid: payload.item.fsid,
				createdBy: auth.sub,
				updatedBy: auth.sub,
				label: payload.label,
			})
			.orNothing()
	})

	commands.on<cmd.data.add_links>("data.add_links", payload => {
		const auth = auth$.value
		if (!auth) return

		void dataCommands
			.addLink({
				fsid: payload.item.fsid,
				createdBy: auth.sub,
				updatedBy: auth.sub,
				link: payload.link,
			})
			.orNothing()
	})

	commands.on<cmd.data.metadata.remove_links>("data.metadata.remove_links", payload => {
		const auth = auth$.value
		if (!auth) return

		void dataCommands
			.removeLink({
				fsid: payload.item.fsid,
				createdBy: auth.sub,
				updatedBy: auth.sub,
				link: payload.link,
			})
			.orNothing()
	})

	commands.emit<cmd.ctx_menu.add>("context-menu.add", {
		cmd: "data.show-rename-modal",
		Icon: BsPencilSquare,
		accelerator: "r",
		readableName: "Переименовать",
		shouldShow: ({ payload }) =>
			!!payload && Data.Validations.isValidDataE(payload as PlainData).fold(F, T),
		type: "update",
	})

	// commands.emit<cmd.ctxMenu.add>("context-menu.add", {
	// 	cmd: "data.show-upload-modal",
	// 	Icon: BsUpload,
	// 	accelerator: "mod+u",
	// 	readableName: "Загрузить...",
	// 	shouldShow: payload => payload && (payload === "root" || payload.fsid),
	// 	type: "create",
	// })

	commands.emit<cmd.ctx_menu.add>("context-menu.add", {
		cmd: "data.show-edit-labels-palette",
		Icon: BsTags,
		accelerator: "l",
		readableName: "Изменить метки",
		shouldShow: ({ payload }) =>
			!!payload && Data.Validations.isValidDataE(payload as PlainData).fold(F, T),
		type: "update",
	})

	commands.emit<cmd.ctx_menu.add>("context-menu.add", {
		cmd: "data.show-edit-links-palette",
		Icon: PiGraph,
		accelerator: "mod+l",
		readableName: "Изменить ссылки",
		shouldShow: ({ payload }) =>
			!!payload && Data.Validations.isValidDataE(payload as PlainData).fold(F, T),
		type: "update",
	})

	commands.emit<cmd.ctx_menu.add>("context-menu.add", {
		cmd: "data.show-create-modal",
		Icon: BsNodePlus,
		accelerator: "mod+a",
		readableName: "Добавить",
		shouldShow: ({ payload }) =>
			!!payload &&
			(Data.Validations.isValidDataE(payload as PlainData).fold(F, T) || payload === "root"),
		type: "create",
	})

	commands.emit<cmd.ctx_menu.add>("context-menu.add", {
		cmd: "data.show-remove-modal",
		Icon: BsNodeMinus,
		readableName: "Удалить",
		shouldShow: ({ payload }) =>
			!!payload && Data.Validations.isValidDataE(payload as PlainData).fold(F, T),
		type: "delete",
	})

	commands.emit<cmd.ctx_menu.add>("context-menu.add", {
		cmd: "command-palette.show",
		Icon: BsArrowRightSquare,
		accelerator: "m",
		readableName: "Переместить...",
		shouldShow: ({ payload }) =>
			!!payload && Data.Validations.isValidDataE(payload as PlainData).fold(F, T),
		payloadCreator: params => {
			const data = data$.value
			const payload = params.payload as PlainData

			const defaultValues =
				payload.parent === null
					? []
					: [
							{
								id: "move-to-root",
								readableName: "Переместить в корневую папку",
								Icon: () => <BsSlash />,
								onSelect: () => {
									commands.emit<cmd.data.metadata.move>("data.metadata.move", {
										parent: null,
										fsid: payload.fsid,
									})
									commands.emit<cmd.modal.hide>("modal.hide")
								},
							},
						]

			return {
				items: defaultValues.concat(
					DataRepository.dropHidden(data ?? [])
						.filter(item => item.fsid !== payload.parent && item.fsid !== payload.fsid)
						.map(
							item =>
								({
									id: item.fsid,
									readable_name: item.name,
									on_select: () => {
										commands.emit<cmd.data.metadata.move>("data.metadata.move", {
											parent: item.fsid,
											fsid: payload.fsid,
										})
										commands.emit<cmd.modal.hide>("modal.hide")
									},
									Icon: () => <BsFileEarmark />, // TODO: Show file or directory icon
								}) satisfies Client.CommandPalette.Item,
						) ?? [],
				),
			}
		},
		type: "update",
	})

	commands.on<cmd.data.get_content>("data.content.get_content", fsid =>
		from_nullable_oath(auth$.getValue())
			.pipe(chain_oath(({ sub }) => dataCommands.getContent({ createdBy: sub, fsid })))
			.pipe(map_oath(result => content$.next({ ...content$.getValue(), [fsid]: result })))
			.invoke(or_else_oath(() => content$.next({ ...content$.getValue(), [fsid]: null }))),
	)

	commands.on<cmd.data.drop_content>("data.content.drop_content", fsid => {
		const contentCopy = content$.getValue()
		contentCopy[fsid] = null

		content$.next(contentCopy)
	})

	commands.on<cmd.data.set_content>(
		"data.content.set_content",
		({ content, fsid, contentType = "text/ordo" }) => {
			const auth = auth$.value
			if (!auth) return

			const data = data$.value
			const length = new Blob([content]).size
			const updatedAt = Date.now()
			const updatedBy = auth.sub
			const createdBy = auth.sub

			void dataCommands
				.updateContent({ createdBy, fsid, content, updatedBy, length, contentType })
				.fork(
					() => void 0,
					size => {
						const dataCopy = [...(data ?? [])]
						const currentData = dataCopy.find(item => item.fsid === fsid)
						const updated = { ...currentData!, updatedAt, size }

						dataCopy.splice(dataCopy.indexOf(currentData!), 1, updated)

						data$.next(dataCopy)

						return
					},
				)
		},
	)

	commands.on<cmd.data.refreshRoot>("data.refresh-root", () => {
		const auth = auth$.value
		const fetch = get_fetch(fid)

		if (!auth) return

		void Oath.fromNullable(auth)
			.chain(auth =>
				Oath.try(() =>
					fetch(`${hosts.dt_host}`, {
						headers: { Authorization: `Bearer ${auth.accessToken}` },
					}).then(res => res.json()),
				),
			)
			.chain(body => (body.success ? Oath.of(body.result) : Oath.Reject(body.error as string)))
			.bitap(
				error =>
					commands.emit<cmd.notification.show>("notification.show", {
						title: "Ошибка",
						message:
							error instanceof Error ? error.message : error ?? "Не удалось получить данные.",
						type: "rrr",
					}),
				result => data$.next(result),
			)
			// Create lib directory for extensions
			.chain(data => Oath.fromNullable(DataRepository.getDataByFSID(data, LIB_DIRECTORY_FSID)))
			.rejectedChain(() =>
				dataCommands.create({
					fsid: LIB_DIRECTORY_FSID,
					name: ".lib",
					parent: null,
					createdBy: auth.sub,
					fileLimit: auth.fileLimit,
				}),
			)
			.orNothing()
	})

	logger.debug("Initialised data.")
}

export const getData = (fid: symbol | null): PlainData[] | null =>
	Either.fromNullable(fid)
		.chain(checkCurrentActivityQueryPermissionE)
		.fold(N, () => data$.value)

export const getData$ = (fid: symbol | null): BehaviorSubject<PlainData[] | null> | null =>
	Either.fromNullable(fid)
		.chain(checkCurrentActivityQueryPermissionE)
		.fold(N, () => data$)

export const data$ = new BehaviorSubject<PlainData[] | null>(null)
export const content$ = new BehaviorSubject<Record<FSID, string | ArrayBuffer | null>>({})

const checkCurrentActivityQueryPermissionE = (fid: symbol) =>
	Either.fromBoolean(
		() => KnownFunctions.check_permissions(fid, { queries: ["data.read"] }),
		() => fid,
	)
