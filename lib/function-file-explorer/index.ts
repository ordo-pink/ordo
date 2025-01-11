/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2025  谢尔盖 ||↓ and the Ordo.pink contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

// import { BsFileEarmarkPlus, BsFileEarmarkRichText } from "@ordo-pink/frontend-icons"
// import { ContextMenuItemType, Metadata, create_function } from "@ordo-pink/core"
// import { Maoka } from "@ordo-pink/maoka"
// import { R } from "@ordo-pink/result"
// import { is_string } from "@ordo-pink/tau"

// import { CreateFileModal } from "../frontend-app/src/components/create-file-modal.component"
// import { EditLabelModal } from "../frontend-app/src/components/edit-label-modal.component"
// import { RenameFileModal } from "../frontend-app/src/components/rename-file-modal.component"
// import { register_move_command } from "./src/commands/move-file.command"
// import { register_remove_file } from "./src/commands/remove-file.command"

// export default create_function(
// 	"pink.ordo.file-explorer",
// 	{
// 		queries: [
// 			"application.commands",
// 			"application.current_route",
// 			"application.fetch",
// 			"application.hosts",
// 			"data.content_query",
// 			"data.metadata_query",
// 			"functions.file_associations",
// 		],
// 		commands: [
// 			"cmd.application.add_translations",
// 			"cmd.application.command_palette.add",
// 			"cmd.application.command_palette.show",
// 			"cmd.application.context_menu.add",
// 			"cmd.application.context_menu.show",
// 			"cmd.application.modal.hide",
// 			"cmd.application.modal.show",
// 			"cmd.application.router.navigate",
// 			"cmd.application.set_title",
// 			"cmd.file_explorer.go_to_file",
// 			"cmd.file_explorer.open_file_explorer",
// 			"cmd.functions.activities.register",
// 			"cmd.metadata.add_labels",
// 			"cmd.metadata.create",
// 			"cmd.metadata.edit_label",
// 			"cmd.metadata.move",
// 			"cmd.metadata.remove_labels",
// 			"cmd.metadata.remove",
// 			"cmd.metadata.rename",
// 			"cmd.metadata.show_create_modal",
// 			"cmd.metadata.show_edit_label_modal",
// 			"cmd.metadata.show_move_palette",
// 		],
// 	},
// 	ctx => {
// 		const logger = ctx.get_logger()

// 		logger.debug("🟡 Initialising file-explorer function...")

// 		const commands = ctx.get_commands()
// 		const mq = ctx.get_metadata_query().cata(R.catas.or_else(() => null as never))

// 		commands.emit("cmd.application.add_translations", {
// 			lang: "en",
// 			translations: {
// 				"t.file_explorer.modals.create_file.input_placeholder": "Ordo Together Strong",
// 				"t.file_explorer.modals.create_file.title": "Create File",
// 				"t.file_explorer.modals.create_file.input_label": "File name",
// 				"t.file_explorer.modals.remove_file.title": "Remove File",
// 				"t.file_explorer.modals.remove_file.message": "Are you sure? Removing files is irreversible.",
// 				"t.file_explorer.modals.rename_file.title": "Rename File",
// 				"t.file_explorer.modals.rename_file.input_label": "New name",
// 				"t.file_explorer.modals.move.title": "Move...",
// 				"t.file_explorer.modals.move.move_to_root": "Move to root directory",
// 			},
// 		})

// 		register_move_command(ctx)
// 		register_remove_file(ctx)

// 		commands.on("cmd.file_explorer.go_to_file", fsid => commands.emit("cmd.application.router.navigate", `/files/${fsid}`))

// 		commands.on("cmd.file_explorer.open_file_explorer", () => commands.emit("cmd.application.router.navigate", "/files"))

// 		// commands.emit("cmd.functions.activities.register", {
// 		// 	fid: ctx.fid,
// 		// 	activity: {
// 		// 		name: "pink.ordo.file-explorer.activity",
// 		// 		routes: ["/files", "/files/:fsid"],
// 		// 		render_workspace: async div => {
// 		// 			await Maoka.render_dom(div, FileExplorer(/*ctx*/))
// 		// 		},
// 		// 		render_icon: span => {
// 		// 			span.innerHTML = BS_FOLDER_2_OPEN
// 		// 		},
// 		// 	},
// 		// })

// 		logger.debug("🟢 Initialised file-explorer function.")
// 	},
// )

// declare global {
// 	interface cmd {
// 		file_explorer: {
// 			open_file_explorer: () => void
// 			go_to_file: () => Ordo.Metadata.FSID | null
// 		}
// 	}
// }
