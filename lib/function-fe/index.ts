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

import { BsFileEarmarkMinus, BsFileEarmarkPlus, BsPencil } from "react-icons/bs"

import { type FSID, Metadata } from "@ordo-pink/data"
import { BS_FOLDER_2_OPEN } from "@ordo-pink/frontend-icons"
import { create_function } from "@ordo-pink/core"
import { render_dom } from "@ordo-pink/maoka"

import { CreateFileModal } from "./src/components/create-file-modal.component"
import { FileExplorer } from "./src/components/fe.component"
import { RemoveFileModal } from "./src/components/remove-file-modal.component"
import { RenameFileModal } from "./src/components/rename-file-modal.component"

export default create_function(
	"pink.ordo.file-explorer",
	{
		queries: [
			"application.commands",
			"application.current_route",
			"data.content_query",
			"application.hosts",
			"application.fetch",
			"data.metadata_query",
		],
		commands: [
			"cmd.functions.activities.register",
			"cmd.application.context_menu.show",
			"cmd.application.set_title",
			"cmd.application.context_menu.add",
			"cmd.application.modal.show",
			"cmd.application.modal.hide",
			"cmd.application.add_translations",
			"cmd.data.metadata.create",
			"cmd.data.metadata.remove",
			"cmd.data.metadata.rename",
			"cmd.application.router.navigate",
			"cmd.file_explorer.go_to_file",
			"cmd.file_explorer.open_file_explorer",
		],
	},
	ctx => {
		const logger = ctx.get_logger()

		logger.debug("🟡 Initialising file-explorer function...")

		const commands = ctx.get_commands()

		commands.emit("cmd.application.add_translations", {
			lang: "en",
			translations: {
				"t.file_explorer.modals.create_file.input_placeholder": "Ordo Together Strong",

				"t.file_explorer.modals.create_file.title": "Create File",
				"t.file_explorer.modals.create_file.input_label": "File name",
				"t.file_explorer.modals.remove_file.title": "Remove File",
				"t.file_explorer.modals.remove_file.message":
					"Are you sure? Removing files is irreversible.",
				"t.file_explorer.modals.rename_file.title": "Rename File",
				"t.file_explorer.modals.rename_file.input_label": "New name",
			},
		})

		// TODO: Move to metadata
		commands.on("cmd.data.metadata.show_remove_modal", fsid =>
			commands.emit("cmd.application.modal.show", {
				render: div => render_dom(div, RemoveFileModal(ctx, fsid)),
			}),
		)

		commands.on("cmd.data.metadata.show_rename_modal", fsid =>
			commands.emit("cmd.application.modal.show", {
				render: div => render_dom(div, RenameFileModal(ctx, fsid)),
			}),
		)

		commands.on("cmd.data.metadata.show_create_modal", fsid =>
			commands.emit("cmd.application.modal.show", {
				render: div => render_dom(div, CreateFileModal(ctx, fsid)),
			}),
		)

		commands.on("cmd.file_explorer.go_to_file", fsid =>
			commands.emit("cmd.application.router.navigate", `/files/${fsid}`),
		)

		commands.on("cmd.file_explorer.open_file_explorer", () =>
			commands.emit("cmd.application.router.navigate", "/files"),
		)

		commands.emit("cmd.application.context_menu.add", {
			cmd: "cmd.data.metadata.show_create_modal",
			Icon: BsFileEarmarkPlus, // TODO: Move to icons
			readable_name: "Create File", // TODO: Translations
			should_show: ({ payload }) => Metadata.Validations.is_metadata(payload) || payload === "root",
			payload_creator: ({ payload }) =>
				Metadata.Validations.is_metadata(payload) ? payload.get_fsid() : null,
			type: "create",
		})

		commands.emit("cmd.application.context_menu.add", {
			cmd: "cmd.data.metadata.show_rename_modal",
			Icon: BsPencil, // TODO: Move to icons
			readable_name: "Rename File", // TODO: Translations
			should_show: ({ payload }) => Metadata.Validations.is_metadata(payload),
			payload_creator: ({ payload }) =>
				Metadata.Validations.is_metadata(payload) && payload.get_fsid(),
			type: "update",
		})

		commands.emit("cmd.application.context_menu.add", {
			cmd: "cmd.data.metadata.show_remove_modal",
			Icon: BsFileEarmarkMinus, // TODO: Move to icons
			readable_name: "Remove File", // TODO: Translations
			should_show: ({ payload }) => Metadata.Validations.is_metadata(payload),
			payload_creator: ({ payload }) =>
				Metadata.Validations.is_metadata(payload) && payload.get_fsid(),
			type: "delete",
		})

		commands.emit("cmd.functions.activities.register", {
			fid: ctx.fid,
			activity: {
				name: "pink.ordo.file-explorer.activity",
				routes: ["/files", "/files/:fsid"],
				render_workspace: div => {
					render_dom(div, FileExplorer(ctx))
				},
				render_icon: span => {
					span.innerHTML = BS_FOLDER_2_OPEN
				},
			},
		})

		logger.debug("🟢 Initialised file-explorer function.")
	},
)

declare global {
	interface cmd {
		file_explorer: {
			open_file_explorer: () => void
			go_to_file: () => FSID | null
		}
	}

	interface t {
		file_explorer: {
			modals: {
				create_file: {
					title: () => string
					input_placeholder: () => string
					input_label: () => string
				}
				remove_file: {
					title: () => string
					message: () => string
				}
				rename_file: {
					title: () => string
					input_label: () => string
				}
			}
		}
	}
}
