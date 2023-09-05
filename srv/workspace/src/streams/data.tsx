// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { cmd } from "@ordo-pink/frontend-core"
import { getCommands } from "./commands"
import { rrrToNotification } from "$utils/error-to-notification"
import { Hosts } from "$utils/hosts"
import { FSEntity } from "@ordo-pink/data/src/common"
import { Oath } from "@ordo-pink/oath"
import { BehaviorSubject, Observable } from "rxjs"
import { Logger } from "@ordo-pink/logger"
import { __Auth$ } from "./auth"
import { Unary } from "@ordo-pink/tau"
import { AuthResponse } from "@ordo-pink/backend-id-server"
import CreateDirectoryModal from "$components/modals/create-directory-modal.component"
import { BsFolderPlus, BsUpload } from "react-icons/bs"
import RemoveDirectoryModal from "$components/modals/remove-directory-modal.component"
import CreateFileModal from "$components/modals/create-file-modal.component"
import RemoveFileModal from "$components/modals/remove-file-modal.component"
import UploadFilesModal from "$components/modals/upload-files-modal.component"
import RenameDirectoryModal from "$components/modals/rename-directory-modal.component"

const commands = getCommands()

export type __Metadata$ = Observable<FSEntity[]>
type Params = { logger: Logger; auth$: __Auth$ }
type Fn = Unary<Params, __Metadata$>
export const __initData: Fn = ({ logger, auth$ }) => {
	commands.on<cmd.data.directory.showRemoveModal>(
		"data.show-remove-directory-modal",
		({ payload }) => {
			commands.emit<cmd.modal.show>("modal.show", {
				Component: () => <RemoveDirectoryModal directory={payload} />,
			})
		},
	)

	commands.on<cmd.data.directory.showCreateModal>(
		"data.show-create-directory-modal",
		({ payload }) => {
			commands.emit<cmd.modal.show>("modal.show", {
				Component: () => <CreateDirectoryModal parent={payload} />,
			})
		},
	)

	commands.on<cmd.data.directory.showRenameModal>(
		"data.show-rename-directory-modal",
		({ payload }) => {
			commands.emit<cmd.modal.show>("modal.show", {
				Component: () => <RenameDirectoryModal directory={payload} />,
			})
		},
	)

	commands.on<cmd.data.file.showCreateModal>("data.show-create-file-modal", ({ payload }) => {
		commands.emit<cmd.modal.show>("modal.show", {
			Component: () => <CreateFileModal parent={payload} />,
		})
	})

	commands.on<cmd.data.file.showRemoveModal>("data.show-remove-file-modal", ({ payload }) => {
		commands.emit<cmd.modal.show>("modal.show", {
			Component: () => <RemoveFileModal file={payload} />,
		})
	})

	commands.on<cmd.data.showUploadModal>("data.show-upload-modal", ({ payload }) => {
		commands.emit<cmd.modal.show>("modal.show", {
			Component: () => <UploadFilesModal parent={payload} />,
		})
	})

	commands.on<cmd.data.file.create>("data.create-file", ({ payload }) => {
		const auth = (auth$ as BehaviorSubject<AuthResponse>).value

		Oath.fromNullable(auth)
			.chain(auth =>
				Oath.try(() =>
					fetch(`${Hosts.DATA}/files/${auth.sub}`, {
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
			.rejectedMap(rrrToNotification("Error creating file"))
			.fork(
				item => {
					commands.emit<cmd.notification.show>("notification.show", item)
				},
				() => {
					commands.emit<cmd.data.refreshRoot>("data.refresh-root")
				},
			)
	})

	commands.on<cmd.data.file.remove>("data.remove-file", ({ payload }) => {
		const auth = (auth$ as BehaviorSubject<AuthResponse>).value

		Oath.fromNullable(auth)
			.chain(auth =>
				Oath.try(() =>
					fetch(`${Hosts.DATA}/files/${auth.sub}${payload}`, {
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
					commands.emit<cmd.data.refreshRoot>("data.refresh-root")
				},
			)
	})

	commands.on<cmd.data.file.setContent>("data.set-file-content", ({ payload }) => {
		const auth = (auth$ as BehaviorSubject<AuthResponse>).value

		Oath.fromNullable(auth)
			.chain(auth =>
				Oath.try(() =>
					fetch(`${Hosts.DATA}/files/${auth.sub}${payload.path}`, {
						method: "PUT",
						headers: { authorization: `Bearer ${auth.accessToken}` },
						body: payload.content,
					}).then(res => res.json()),
				),
			)
			.chain(body => (body.success ? Oath.of(body.result) : Oath.reject(body.error as string)))
			.rejectedMap(rrrToNotification("Error uploading files"))
			.fork(
				item => {
					commands.emit<cmd.notification.show>("notification.show", item)
				},
				() => {
					commands.emit<cmd.data.refreshRoot>("data.refresh-root")
				},
			)
	})

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
					commands.emit<cmd.notification.show>("notification.show", item)
				},
				() => {
					commands.emit<cmd.data.refreshRoot>("data.refresh-root")
				},
			)
	})

	commands.on<cmd.data.directory.update>("data.update-directory", ({ payload }) => {
		const auth = (auth$ as BehaviorSubject<AuthResponse>).value

		Oath.fromNullable(auth)
			.chain(auth =>
				Oath.try(() =>
					fetch(`${Hosts.DATA}/directories/${auth.sub}${payload.path}`, {
						method: "PATCH",
						headers: {
							"content-type": "application/json",
							authorization: `Bearer ${auth.accessToken}`,
						},
						body: JSON.stringify(payload.update),
					}).then(res => res.json()),
				),
			)
			.chain(body => (body.success ? Oath.of(body.result) : Oath.reject(body.error as string)))
			.rejectedMap(rrrToNotification("Error updating directory"))
			.fork(
				item => {
					commands.emit<cmd.notification.show>("notification.show", item)
				},
				() => {
					commands.emit<cmd.data.refreshRoot>("data.refresh-root")
				},
			)
	})

	commands.on<cmd.data.directory.remove>("data.remove-directory", ({ payload }) => {
		const auth = (auth$ as BehaviorSubject<AuthResponse>).value

		Oath.fromNullable(auth)
			.chain(auth =>
				Oath.try(() =>
					fetch(`${Hosts.DATA}/directories/${auth.sub}${payload}`, {
						method: "DELETE",
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
					commands.emit<cmd.notification.show>("notification.show", item)
				},
				() => {
					commands.emit<cmd.data.refreshRoot>("data.refresh-root")
				},
			)
	})

	commands.emit<cmd.commandPalette.add>("command-palette.add", {
		id: "data.show-create-directory-modal",
		Icon: BsFolderPlus,
		readableName: "Create directory",
		accelerator: "meta+shift+n",
		onSelect: () => {
			commands.emit<cmd.commandPalette.hide>("command-palette.hide")
			commands.emit<cmd.data.directory.showCreateModal>("data.show-create-directory-modal")
		},
	})

	commands.emit<cmd.commandPalette.add>("command-palette.add", {
		id: "data.show-upload-modal",
		Icon: BsUpload,
		readableName: "Upload files",
		accelerator: "mod+u",
		onSelect: () => {
			commands.emit<cmd.commandPalette.hide>("command-palette.hide")
			commands.emit<cmd.data.showUploadModal>("data.show-upload-modal")
		},
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
