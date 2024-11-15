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

// import { BsFileEarmarkMinus, BsFileEarmarkPlus, BsPencil } from "react-icons/bs"

import {
	BS_FOLDER_2_OPEN,
	BsFileEarmarkMinus,
	BsFileEarmarkPlus,
	BsFileEarmarkRichText,
} from "@ordo-pink/frontend-icons"
import { ContextMenuItemType, Metadata, create_function } from "@ordo-pink/core"
import { Maoka } from "@ordo-pink/maoka"
import { Result } from "@ordo-pink/result"
import { is_string } from "@ordo-pink/tau"

import { CreateFileModal } from "./src/components/create-file-modal.component"
import { EditLabelModal } from "./src/components/edit-label-modal.component"
import { FileExplorer } from "./src/components/fe.component"
import { RemoveFileModal } from "./src/components/remove-file-modal.component"
import { RenameFileModal } from "./src/components/rename-file-modal.component"

export default create_function(
	"pink.ordo.file-explorer",
	{
		queries: [
			"application.commands",
			"application.current_route",
			"application.fetch",
			"application.hosts",
			"data.content_query",
			"data.metadata_query",
			"functions.file_associations",
		],
		commands: [
			"cmd.application.add_translations",
			"cmd.application.command_palette.add",
			"cmd.application.command_palette.show",
			"cmd.application.context_menu.add",
			"cmd.application.context_menu.show",
			"cmd.application.modal.hide",
			"cmd.application.modal.show",
			"cmd.application.router.navigate",
			"cmd.application.set_title",
			"cmd.file_explorer.go_to_file",
			"cmd.file_explorer.open_file_explorer",
			"cmd.functions.activities.register",
			"cmd.metadata.add_labels",
			"cmd.metadata.create",
			"cmd.metadata.edit_label",
			"cmd.metadata.remove",
			"cmd.metadata.rename",
			"cmd.metadata.show_create_modal",
			"cmd.metadata.show_edit_label_modal",
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
		commands.on("cmd.metadata.show_remove_modal", fsid =>
			commands.emit("cmd.application.modal.show", {
				render: div => void Maoka.render_dom(div, RemoveFileModal(ctx, fsid)),
			}),
		)

		commands.on("cmd.metadata.show_rename_modal", fsid =>
			commands.emit("cmd.application.modal.show", {
				render: div => void Maoka.render_dom(div, RenameFileModal(ctx, fsid)),
			}),
		)

		commands.on("cmd.metadata.show_create_modal", fsid =>
			commands.emit("cmd.application.modal.show", {
				render: div => void Maoka.render_dom(div, CreateFileModal(ctx, fsid)),
			}),
		)

		commands.emit("cmd.application.command_palette.add", {
			on_select: () => commands.emit("cmd.metadata.show_create_modal", null),
			hotkey: "mod+shift+n",
			readable_name: "t.file_explorer.modals.create_file.title",
			render_icon: div => void div.appendChild(BsFileEarmarkPlus() as SVGSVGElement),
		})

		commands.on("cmd.file_explorer.go_to_file", fsid =>
			commands.emit("cmd.application.router.navigate", `/files/${fsid}`),
		)

		commands.on("cmd.file_explorer.open_file_explorer", () =>
			commands.emit("cmd.application.router.navigate", "/files"),
		)

		commands.on("cmd.metadata.show_edit_label_modal", label => {
			commands.emit("cmd.application.modal.show", {
				show_close_button: true,
				// TODO Grap ctx
				render: div => void Maoka.render_dom(div, EditLabelModal(ctx, label)),
			})
		})

		commands.on("cmd.metadata.show_edit_labels_palette", fsid => {
			const metadata_query = ctx
				.get_metadata_query()
				.cata(Result.catas.or_else(() => null as never))

			const show_labels_palette = () => {
				const current_labels = metadata_query
					.get_by_fsid(fsid)
					.pipe(Result.ops.chain(Result.FromOption))
					.pipe(Result.ops.map(metadata => metadata.get_labels()))
					.cata(Result.catas.or_else(() => [] as Ordo.Metadata.Label[]))

				const available_labels = metadata_query
					.get()
					.pipe(Result.ops.map(metadata => metadata.flatMap(item => item.get_labels())))
					.pipe(Result.ops.map(labels => labels.filter(label => !current_labels.includes(label))))
					.pipe(Result.ops.map(labels => [...new Set(labels)]))
					.cata(Result.catas.or_else(() => [] as Ordo.Metadata.Label[]))

				commands.emit("cmd.application.command_palette.show", {
					is_multiple: true,
					on_new_item: value => {
						commands.emit("cmd.metadata.add_labels", { fsid, labels: [value] })
						show_labels_palette()
					},
					items: available_labels.map(label => ({
						readable_name: (is_string(label) ? label : label.name) as Ordo.I18N.TranslationKey,
						on_select: () => commands.emit("cmd.metadata.add_labels", { fsid, labels: [label] }),
					})),
					max_items: 200,
					pinned_items: current_labels.map(label => ({
						readable_name: (is_string(label) ? label : label.name) as Ordo.I18N.TranslationKey,
						on_select: () => commands.emit("cmd.metadata.remove_labels", { fsid, labels: [label] }),
					})),
				})
			}

			show_labels_palette()
		})

		commands.emit("cmd.application.context_menu.add", {
			command: "cmd.metadata.show_edit_labels_palette",
			// TODO render_icon: div => div.appendChild(BsFileEarmarkPlus() as SVGSVGElement),
			readable_name: "t.common.metadata.show_edit_labels_palette", // TODO
			should_show: ({ payload }) => Metadata.Validations.is_metadata(payload) || payload === "root",
			payload_creator: ({ payload }) =>
				Metadata.Validations.is_metadata(payload) ? payload.get_fsid() : null,
			type: ContextMenuItemType.CREATE,
		})

		commands.emit("cmd.application.context_menu.add", {
			command: "cmd.metadata.show_create_modal",
			render_icon: div => div.appendChild(BsFileEarmarkPlus() as SVGSVGElement), // TODO: Move to icons
			readable_name: "t.file_explorer.modals.create_file.title",
			should_show: ({ payload }) => Metadata.Validations.is_metadata(payload) || payload === "root",
			payload_creator: ({ payload }) =>
				Metadata.Validations.is_metadata(payload) ? payload.get_fsid() : null,
			type: ContextMenuItemType.CREATE,
		})

		commands.emit("cmd.application.context_menu.add", {
			command: "cmd.metadata.show_rename_modal",
			render_icon: div => div.appendChild(BsFileEarmarkRichText() as SVGSVGElement),
			readable_name: "t.file_explorer.modals.rename_file.title",
			should_show: ({ payload }) => Metadata.Validations.is_metadata(payload),
			payload_creator: ({ payload }) =>
				Metadata.Validations.is_metadata(payload) && payload.get_fsid(),
			type: ContextMenuItemType.UPDATE,
		})

		commands.emit("cmd.application.context_menu.add", {
			command: "cmd.metadata.show_remove_modal",
			render_icon: div => div.appendChild(BsFileEarmarkMinus() as SVGSVGElement),
			readable_name: "t.file_explorer.modals.remove_file.title" as Ordo.I18N.TranslationKey,
			should_show: ({ payload }) => Metadata.Validations.is_metadata(payload),
			payload_creator: ({ payload }) =>
				Metadata.Validations.is_metadata(payload) && payload.get_fsid(),
			type: ContextMenuItemType.DELETE,
		})

		commands.emit("cmd.functions.activities.register", {
			fid: ctx.fid,
			activity: {
				name: "pink.ordo.file-explorer.activity",
				routes: ["/files", "/files/:fsid"],
				render_workspace: async div => {
					await Maoka.render_dom(div, FileExplorer(/*ctx*/))
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
			go_to_file: () => Ordo.Metadata.FSID | null
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
