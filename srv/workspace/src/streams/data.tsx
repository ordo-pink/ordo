// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { CommandPalette, cmd } from "@ordo-pink/frontend-core"
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
import {
	BsArrowRightSquare,
	BsNodeMinus,
	BsNodePlus,
	BsPencilSquare,
	BsTag,
	BsTags,
} from "react-icons/bs"
import FileIconComponent from "$functions/file-explorer/components/file-icon.component"

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

	commands.on<cmd.data.showEditLabelsPalette>("data.show-edit-labels-palette", ({ payload }) => {
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
		const { name, parent, labels = [] } = payload

		dataCommands
			.create({ name, parent, createdBy: auth.sub, fileLimit: auth.fileLimit, labels })
			.orElse(message =>
				commands.emit<cmd.notification.show>("notification.show", {
					message,
					type: "rrr",
					title: "Error creating data",
				}),
			)
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

	commands.on<cmd.data.setChildOrder>("data.set-child-order", ({ payload }) => {
		const auth = (auth$ as BehaviorSubject<AuthResponse>).value
		const data = data$.value

		const item = data.find(d => d.fsid === payload.fsid && d.createdBy === auth.sub)

		if (!item) return

		dataCommands
			.update({
				createdBy: auth.sub,
				updatedBy: auth.sub,
				fsid: payload.fsid,
				data: { ...item, children: payload.children },
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

	commands.emit<cmd.ctxMenu.add>("context-menu.add", {
		cmd: "data.show-rename-modal",
		Icon: BsPencilSquare,
		readableName: "Rename",
		shouldShow: ({ payload }) =>
			payload && payload.fsid && payload.name && payload.name !== ".inbox",
		type: "update",
	})

	commands.emit<cmd.ctxMenu.add>("context-menu.add", {
		cmd: "data.show-edit-labels-palette",
		Icon: BsTags,
		readableName: "Edit labels",
		shouldShow: ({ payload }) => payload && payload.fsid && payload.name,
		type: "update",
	})

	commands.emit<cmd.ctxMenu.add>("context-menu.add", {
		cmd: "data.show-create-modal",
		Icon: BsNodePlus,
		readableName: "Add",
		shouldShow: ({ payload }) => payload && payload.fsid,
		type: "create",
	})

	commands.emit<cmd.ctxMenu.add>("context-menu.add", {
		cmd: "data.show-remove-modal",
		Icon: BsNodeMinus,
		readableName: "Remove",
		shouldShow: ({ payload }) => payload && payload.fsid,
		type: "delete",
	})

	commands.emit<cmd.ctxMenu.add>("context-menu.add", {
		cmd: "command-palette.show",
		Icon: BsArrowRightSquare,
		readableName: "Move...",
		shouldShow: ({ payload }) =>
			payload && payload.fsid && payload.name && payload.name !== ".inbox",
		payloadCreator: ({ payload }) => {
			const data = data$.value

			return {
				items: data?.map(
					item =>
						({
							id: item.name,
							readableName: item.name,
							onSelect: () => {
								commands.emit<cmd.data.move>("data.move", { parent: item.fsid, fsid: payload.fsid })
								commands.emit<cmd.modal.hide>("modal.hide")
							},
							Icon: () => <FileIconComponent plain={item} />,
						} satisfies CommandPalette.Item),
				),
			}
		},
		type: "update",
	})

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
