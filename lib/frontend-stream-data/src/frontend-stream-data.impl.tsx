// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import {
	BsArrowRightSquare,
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

import { Data, PlainData, TDataCommands } from "@ordo-pink/data"
import { EXTENSION_FILE_PREFIX } from "@ordo-pink/core"
import { Either } from "@ordo-pink/either"
import { KnownFunctions } from "@ordo-pink/frontend-known-functions"
import { N } from "@ordo-pink/tau"
import { Oath } from "@ordo-pink/oath"
import { auth$ } from "@ordo-pink/frontend-stream-user"
import { getCommands } from "@ordo-pink/frontend-stream-commands"
import { getFetch } from "@ordo-pink/frontend-fetch"
import { getHosts } from "@ordo-pink/frontend-react-hooks"
import { getLogger } from "@ordo-pink/frontend-logger"

import CreateFileModal from "./components/create-file-modal.component"
import RemoveFileModal from "./components/remove-file-modal.component"
import RenameModal from "./components/rename-modal.component"

type P = { fid: symbol; dataCommands: TDataCommands<string | ArrayBuffer> }
export const __initData = ({ fid, dataCommands }: P) => {
	const logger = getLogger(fid)
	const commands = getCommands(fid)
	const hosts = getHosts()

	logger.debug("Initialising data...")

	commands.on<cmd.data.showCreateModal>("data.show-create-modal", payload => {
		commands.emit<cmd.modal.show>("modal.show", {
			Component: () => <CreateFileModal parent={payload} />,
		})
	})

	commands.on<cmd.data.showEditLabelsPalette>("data.show-edit-labels-palette", payload => {
		const data = data$.value
		const labels = Array.from(new Set(data.flatMap(item => item.labels)))

		commands.emit<cmd.commandPalette.show>("command-palette.show", {
			onNewItem: label => {
				commands.emit<cmd.data.addLabel>("data.add-label", { item: payload, label })
				commands.emit<cmd.commandPalette.hide>("command-palette.hide")
			},
			multiple: true,
			pinnedItems: payload.labels.map(label => ({
				id: label,
				readableName: label,
				Icon: BsTag,
				onSelect: () => {
					commands.emit<cmd.data.removeLabel>("data.remove-label", { item: payload, label })
				},
			})),
			items: labels
				.filter(label => !payload.labels.includes(label))
				.map(label => ({
					id: label,
					readableName: label,
					Icon: BsTag,
					onSelect: () => {
						commands.emit<cmd.data.addLabel>("data.add-label", { item: payload, label })
					},
				})),
		})
	})

	commands.on<cmd.data.showEditLinksPalette>("data.show-edit-links-palette", payload => {
		const data = data$.value

		commands.emit<cmd.commandPalette.show>("command-palette.show", {
			multiple: true,
			pinnedItems: payload.links.map(link => ({
				id: link,
				readableName: data.find(item => item.fsid === link)!.name,
				Icon: BsLink,
				onSelect: () => {
					commands.emit<cmd.data.removeLink>("data.remove-link", { item: payload, link })
				},
			})),
			items: data
				.filter(
					data =>
						!payload.links.includes(data.fsid) &&
						data.fsid !== payload.fsid &&
						!data.name.startsWith(EXTENSION_FILE_PREFIX),
				)
				.map(link => ({
					id: link.fsid,
					readableName: link.name,
					Icon: BsLink,
					onSelect: () => {
						commands.emit<cmd.data.addLink>("data.add-link", { item: payload, link: link.fsid })
					},
				})),
		})
	})

	commands.on<cmd.data.showRemoveModal>("data.show-remove-modal", payload => {
		commands.emit<cmd.modal.show>("modal.show", {
			Component: () => <RemoveFileModal data={payload} />,
		})
	})

	commands.on<cmd.data.showRenameModal>("data.show-rename-modal", payload => {
		commands.emit<cmd.modal.show>("modal.show", {
			Component: () => <RenameModal data={payload} />,
		})
	})

	// commands.on<cmd.data.showUploadModal>("data.show-upload-modal", payload => {
	// 	commands.emit<cmd.modal.show>("modal.show", {
	// 		Component: () => <UploadFilesModal parent={payload} />,
	// 	})
	// })

	commands.on<cmd.data.create>("data.create", payload => {
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

	commands.on<cmd.data.remove>("data.remove", payload => {
		const auth = auth$.value
		if (!auth) return

		void dataCommands.remove({ fsid: payload.fsid, createdBy: auth.sub }).orNothing()
	})

	commands.on<cmd.data.rename>("data.rename", payload => {
		const auth = auth$.value
		if (!auth) return

		void dataCommands
			.rename({ fsid: payload.fsid, createdBy: auth.sub, name: payload.name, updatedBy: auth.sub })
			.orNothing()
	})

	commands.on<cmd.data.move>("data.move", payload => {
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

	commands.on<cmd.data.addLabel>("data.add-label", payload => {
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

	commands.on<cmd.data.removeLabel>("data.remove-label", payload => {
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

	commands.on<cmd.data.addLink>("data.add-link", payload => {
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

	commands.on<cmd.data.removeLink>("data.remove-link", payload => {
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

	commands.emit<cmd.ctxMenu.add>("context-menu.add", {
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

	commands.emit<cmd.ctxMenu.add>("context-menu.add", {
		cmd: "data.show-edit-labels-palette",
		Icon: BsTags,
		accelerator: "l",
		readableName: "Изменить метки",
		shouldShow: ({ payload }) =>
			!!payload && Data.Validations.isValidDataE(payload as PlainData).fold(F, T),
		type: "update",
	})

	commands.emit<cmd.ctxMenu.add>("context-menu.add", {
		cmd: "data.show-edit-links-palette",
		Icon: PiGraph,
		accelerator: "mod+l",
		readableName: "Изменить ссылки",
		shouldShow: ({ payload }) =>
			!!payload && Data.Validations.isValidDataE(payload as PlainData).fold(F, T),
		type: "update",
	})

	commands.emit<cmd.ctxMenu.add>("context-menu.add", {
		cmd: "data.show-create-modal",
		Icon: BsNodePlus,
		accelerator: "mod+a",
		readableName: "Добавить",
		shouldShow: ({ payload }) =>
			!!payload &&
			(Data.Validations.isValidDataE(payload as PlainData).fold(F, T) || payload === "root"),
		type: "create",
	})

	commands.emit<cmd.ctxMenu.add>("context-menu.add", {
		cmd: "data.show-remove-modal",
		Icon: BsNodeMinus,
		readableName: "Удалить",
		shouldShow: ({ payload }) =>
			!!payload && Data.Validations.isValidDataE(payload as PlainData).fold(F, T),
		type: "delete",
	})

	commands.emit<cmd.ctxMenu.add>("context-menu.add", {
		cmd: "command-palette.show",
		Icon: BsArrowRightSquare,
		accelerator: "m",
		readableName: "Переместить...",
		shouldShow: ({ payload }) =>
			!!payload && Data.Validations.isValidDataE(payload as PlainData).fold(F, T),
		payloadCreator: params => {
			const data = data$.value
			const payload = params.payload as PlainData

			return {
				items: [
					{
						id: "move-to-root",
						readableName: "Переместить в корневую папку",
						Icon: () => <BsSlash />,
						onSelect: () => {
							commands.emit<cmd.data.move>("data.move", { parent: null, fsid: payload.fsid })
							commands.emit<cmd.modal.hide>("modal.hide")
						},
					},
				].concat(
					data
						?.filter(item => item.fsid !== payload.parent && item.fsid !== payload.fsid)
						.map(
							item =>
								({
									id: item.name,
									readableName: item.name,
									onSelect: () => {
										commands.emit<cmd.data.move>("data.move", {
											parent: item.fsid,
											fsid: payload.fsid,
										})
										commands.emit<cmd.modal.hide>("modal.hide")
									},
									// Icon: () => <FileIconComponent plain={item} />,
									Icon: () => <div>TODO</div>,
								}) satisfies Client.CommandPalette.Item,
						),
				),
			}
		},
		type: "update",
	})

	commands.on<cmd.data.getFileContent>("data.get-content", ({ fsid }) => {
		const auth = auth$.value
		if (!auth) return

		void dataCommands.getContent({ createdBy: auth.sub, fsid }).fork(
			() => void 0,
			value => content$.next(value),
		)
	})

	commands.on<cmd.data.setContent>(
		"data.set-content",
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
						const dataCopy = [...data]
						const currentData = dataCopy.find(item => item.fsid === fsid)
						const updated = { ...currentData!, updatedAt, size }

						dataCopy.splice(dataCopy.indexOf(currentData!), 1, updated)

						data$.next(dataCopy)
					},
				)
		},
	)

	commands.on<cmd.data.refreshRoot>("data.refresh-root", () => {
		const auth = auth$.value
		const fetch = getFetch(fid)
		if (!auth) return

		void Oath.fromNullable(auth)
			.chain(auth =>
				Oath.try(() =>
					fetch(`${hosts.dtHost}`, {
						headers: { Authorization: `Bearer ${auth.accessToken}` },
					}).then(res => res.json()),
				),
			)
			.chain(body => (body.success ? Oath.of(body.result) : Oath.reject(body.error as string)))
			.fork(
				error =>
					commands.emit<cmd.notification.show>("notification.show", {
						title: "Ошибка",
						message:
							error instanceof Error ? error.message : error ?? "Не удалось получить данные.",
						type: "rrr",
					}),
				result => data$.next(result),
			)
	})

	logger.debug("Initialised data.")
}

export const getData = (fid: symbol | null): PlainData[] | null =>
	Either.fromNullable(fid)
		.chain(checkCurrentActivityQueryPermissionE)
		.fold(N, () => data$.value)

export const data$ = new BehaviorSubject<PlainData[]>([])
export const content$ = new BehaviorSubject<string | ArrayBuffer | null>(null)

const checkCurrentActivityQueryPermissionE = (fid: symbol) =>
	Either.fromBoolean(
		() => KnownFunctions.checkPermissions(fid, { queries: ["data.read"] }),
		() => fid,
	)
