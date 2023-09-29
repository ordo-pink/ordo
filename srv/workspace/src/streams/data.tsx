// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { cmd } from "@ordo-pink/frontend-core"
import { getCommands } from "./commands"
import { rrrToNotification } from "$utils/error-to-notification"
import { Hosts } from "$utils/hosts"
import { Oath } from "@ordo-pink/oath"
import { BehaviorSubject, Observable } from "rxjs"
import { Logger } from "@ordo-pink/logger"
import { __Auth$ } from "./auth"
import { Unary } from "@ordo-pink/tau"
import { AuthResponse } from "@ordo-pink/backend-id-server"
import CreatePageModal from "$components/modals/create-page-modal.component"
import UploadFilesModal from "$components/modals/upload-files-modal.component"
import { DataCommands, PlainData } from "@ordo-pink/data"
import { ClientDataRepository } from "../repositories/client-data-repository.impl"
import { ClientContentRepository } from "../repositories/client-content-repository"
import RemoveFileModal from "$components/modals/remove-page-modal.component"
import RenameDirectoryModal from "$components/modals/rename-modal.component"
import { BsTag } from "react-icons/bs"

const commands = getCommands()

export type __Metadata$ = Observable<PlainData[]>
type Params = { logger: Logger; auth$: __Auth$ }
type Fn = Unary<Params, __Metadata$>

export const __initData: Fn = ({ logger, auth$ }) => {
	logger.debug("Initializing data")

	const dataRepository = ClientDataRepository.of(data$, auth$ as any, commands)
	const contentRepository = ClientContentRepository.of()

	const dataCommands = DataCommands.of({ dataRepository, contentRepository })

	commands.on<cmd.data.showCreateModal>("data.show-create-modal", ({ payload }) => {
		commands.emit<cmd.modal.show>("modal.show", {
			Component: () => <CreatePageModal parent={payload} />,
		})
	})

	commands.on<cmd.data.showAddLabelPalette>("data.show-add-label-palette", ({ payload }) => {
		const data = data$.value
		const labels = Array.from(new Set(data.flatMap(item => item.labels)))

		commands.emit<cmd.commandPalette.show>("command-palette.show", {
			onNewItem: label => {
				commands.emit<cmd.data.addLabel>("data.add-label", { item: payload, label })
				commands.emit<cmd.commandPalette.hide>("command-palette.hide")
			},
			items: labels
				.filter(label => !payload.labels.includes(label))
				.map(label => ({
					id: label,
					readableName: label,
					Icon: BsTag,
					onSelect: () => {
						commands.emit<cmd.data.addLabel>("data.add-label", { item: payload, label })
						commands.emit<cmd.commandPalette.hide>("command-palette.hide")
					},
				})),
		})
	})

	commands.on<cmd.data.showRemoveLabelPalette>("data.show-remove-label-palette", ({ payload }) => {
		commands.emit<cmd.commandPalette.show>("command-palette.show", {
			items: payload.labels.map(label => ({
				id: label,
				readableName: label,
				Icon: BsTag,
				onSelect: () => {
					commands.emit<cmd.data.removeLabel>("data.remove-label", { item: payload, label })
					commands.emit<cmd.commandPalette.hide>("command-palette.hide")
				},
			})),
		})
	})

	commands.on<cmd.data.showRemoveModal>("data.show-remove-modal", ({ payload }) => {
		commands.emit<cmd.modal.show>("modal.show", {
			Component: () => <RemoveFileModal data={payload} />,
		})
	})

	commands.on<cmd.data.showRenameModal>("data.show-rename-modal", ({ payload }) => {
		commands.emit<cmd.modal.show>("modal.show", {
			Component: () => <RenameDirectoryModal data={payload} />,
		})
	})

	commands.on<cmd.data.showUploadModal>("data.show-upload-modal", ({ payload }) => {
		commands.emit<cmd.modal.show>("modal.show", {
			Component: () => <UploadFilesModal parent={payload} />,
		})
	})

	commands.on<cmd.data.create>("data.create", ({ payload }) => {
		const auth = (auth$ as BehaviorSubject<AuthResponse>).value
		const { name, parent } = payload

		dataCommands.create({ name, parent, createdBy: auth.sub, updatedBy: auth.sub }).orNothing()
	})

	commands.on<cmd.data.remove>("data.remove", ({ payload }) => {
		const auth = (auth$ as BehaviorSubject<AuthResponse>).value
		dataCommands.remove({ fsid: payload.fsid, createdBy: auth.sub }).orNothing()
	})

	commands.on<cmd.data.rename>("data.rename", ({ payload }) => {
		const auth = (auth$ as BehaviorSubject<AuthResponse>).value

		dataCommands
			.rename({ fsid: payload.fsid, createdBy: auth.sub, name: payload.name, updatedBy: auth.sub })
			.orNothing()
	})

	commands.on<cmd.data.move>("data.move", ({ payload }) => {
		const auth = (auth$ as BehaviorSubject<AuthResponse>).value

		dataCommands
			.move({
				fsid: payload.fsid,
				createdBy: auth.sub,
				parent: payload.parent,
				updatedBy: auth.sub,
			})
			.orNothing()
	})

	commands.on<cmd.data.addLabel>("data.add-label", ({ payload }) => {
		const auth = (auth$ as BehaviorSubject<AuthResponse>).value

		dataCommands
			.addLabel({
				fsid: payload.item.fsid,
				createdBy: auth.sub,
				updatedBy: auth.sub,
				label: payload.label,
			})
			.orNothing()
	})

	commands.on<cmd.data.removeLabel>("data.remove-label", ({ payload }) => {
		const auth = (auth$ as BehaviorSubject<AuthResponse>).value

		dataCommands
			.removeLabel({
				fsid: payload.item.fsid,
				createdBy: auth.sub,
				updatedBy: auth.sub,
				label: payload.label,
			})
			.orNothing()
	})

	// commands.on<cmd.data.file.setContent>("data.set-file-content", ({ payload }) => {
	// 	const auth = (auth$ as BehaviorSubject<AuthResponse>).value

	// 	Oath.fromNullable(auth)
	// 		.chain(auth =>
	// 			Oath.try(() =>
	// 				fetch(`${Hosts.DATA}/files/${auth.sub}${payload.path}`, {
	// 					method: "PUT",
	// 					headers: { authorization: `Bearer ${auth.accessToken}` },
	// 					body: payload.content,
	// 				}).then(res => res.json()),
	// 			),
	// 		)
	// 		.chain(body => (body.success ? Oath.of(body.result) : Oath.reject(body.error as string)))
	// 		.rejectedMap(rrrToNotification("Error uploading files"))
	// 		.fork(
	// 			item => {
	// 				commands.emit<cmd.notification.show>("notification.show", item)
	// 			},
	// 			() => {
	// 				commands.emit<cmd.data.refreshRoot>("data.refresh-root")
	// 			},
	// 		)
	// })

	// commands.on<cmd.data.directory.create>("data.create-directory", ({ payload }) => {
	// 	const auth = (auth$ as BehaviorSubject<AuthResponse>).value

	// 	Oath.fromNullable(auth)
	// 		.chain(auth =>
	// 			Oath.try(() =>
	// 				fetch(`${Hosts.DATA}/directories/${auth.sub}`, {
	// 					method: "POST",
	// 					body: JSON.stringify(payload),
	// 					headers: {
	// 						"content-type": "application/json",
	// 						authorization: `Bearer ${auth.accessToken}`,
	// 					},
	// 				}).then(res => res.json()),
	// 			),
	// 		)
	// 		.chain(body => (body.success ? Oath.of(body.result) : Oath.reject(body.error as string)))
	// 		.rejectedMap(rrrToNotification("Error creating directory"))
	// 		.fork(
	// 			item => {
	// 				commands.emit<cmd.notification.show>("notification.show", item)
	// 			},
	// 			() => {
	// 				commands.emit<cmd.data.refreshRoot>("data.refresh-root")
	// 			},
	// 		)
	// })

	// commands.on<cmd.data.directory.update>("data.update-directory", ({ payload }) => {
	// 	const auth = (auth$ as BehaviorSubject<AuthResponse>).value

	// 	Oath.fromNullable(auth)
	// 		.chain(auth =>
	// 			Oath.try(() =>
	// 				fetch(`${Hosts.DATA}/directories/${auth.sub}${payload.path}`, {
	// 					method: "PATCH",
	// 					headers: {
	// 						"content-type": "application/json",
	// 						authorization: `Bearer ${auth.accessToken}`,
	// 					},
	// 					body: JSON.stringify(payload.update),
	// 				}).then(res => res.json()),
	// 			),
	// 		)
	// 		.chain(body => (body.success ? Oath.of(body.result) : Oath.reject(body.error as string)))
	// 		.rejectedMap(rrrToNotification("Error updating directory"))
	// 		.fork(
	// 			item => {
	// 				commands.emit<cmd.notification.show>("notification.show", item)
	// 			},
	// 			() => {
	// 				commands.emit<cmd.data.refreshRoot>("data.refresh-root")
	// 			},
	// 		)
	// })

	// commands.on<cmd.data.directory.remove>("data.remove-directory", ({ payload }) => {
	// 	const auth = (auth$ as BehaviorSubject<AuthResponse>).value

	// 	Oath.fromNullable(auth)
	// 		.chain(auth =>
	// 			Oath.try(() =>
	// 				fetch(`${Hosts.DATA}/directories/${auth.sub}${payload}`, {
	// 					method: "DELETE",
	// 					headers: {
	// 						"content-type": "application/json",
	// 						authorization: `Bearer ${auth.accessToken}`,
	// 					},
	// 				}).then(res => res.json()),
	// 			),
	// 		)
	// 		.chain(body => (body.success ? Oath.of(body.result) : Oath.reject(body.error as string)))
	// 		.rejectedMap(rrrToNotification("Error creating directory"))
	// 		.fork(
	// 			item => {
	// 				commands.emit<cmd.notification.show>("notification.show", item)
	// 			},
	// 			() => {
	// 				commands.emit<cmd.data.refreshRoot>("data.refresh-root")
	// 			},
	// 		)
	// })

	// commands.emit<cmd.commandPalette.add>("command-palette.add", {
	// 	id: "data.show-create-modal",
	// 	Icon: BsNodePlus,
	// 	readableName: "Create page",
	// 	accelerator: "meta+n",
	// 	onSelect: () => {
	// 		commands.emit<cmd.commandPalette.hide>("command-palette.hide")
	// 		commands.emit<cmd.data.showCreateModal>("data.show-create-modal")
	// 	},
	// })

	// commands.emit<cmd.commandPalette.add>("command-palette.add", {
	// 	id: "data.show-upload-modal",
	// 	Icon: BsUpload,
	// 	readableName: "Upload files",
	// 	accelerator: "mod+u",
	// 	onSelect: () => {
	// 		commands.emit<cmd.commandPalette.hide>("command-palette.hide")
	// 		commands.emit<cmd.data.showUploadModal>("data.show-upload-modal")
	// 	},
	// })

	commands.on<cmd.data.refreshRoot>("data.refresh-root", () => {
		const auth = (auth$ as BehaviorSubject<AuthResponse>).value

		Oath.fromNullable(auth)
			.chain(auth =>
				Oath.try(() =>
					fetch(`${Hosts.DATA}`, {
						headers: { Authorization: `Bearer ${auth.accessToken}` },
					}).then(res => res.json()),
				),
			)
			.chain(body => (body.success ? Oath.of(body.result) : Oath.reject(body.error as string)))
			.rejectedMap(rrrToNotification("Error fetching directories"))
			.fork(
				item => commands.emit<cmd.notification.show>("notification.show", item),
				result => data$.next(result),
			)
	})

	return data$
}

const data$ = new BehaviorSubject<PlainData[]>([])
