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

// import { BsLayoutTextWindow } from "react-icons/bs"

import { BS_LAYOUT_TEXT_WINDOW } from "@ordo-pink/frontend-icons"
import { Maoka } from "@ordo-pink/maoka"
import { create_function } from "@ordo-pink/core"

import { FileEditorSidebar } from "./src/file-editor.sidebar"
import { FileEditorWorkspace } from "./src/file-editor.workspace"

declare global {
	interface cmd {
		file_editor: {
			open: () => void
			open_file: () => Ordo.Metadata.FSID
		}
	}

	interface t {
		file_editor: {
			command_palette: {
				open: () => string
				open_file: () => string
			}
		}
	}
}

export default create_function(
	"pink.ordo.editor",
	{
		commands: [
			"cmd.functions.activities.register",
			"cmd.application.add_translations",
			"cmd.application.router.navigate",
			"cmd.application.set_title",
			"cmd.application.command_palette.add",
			"cmd.metadata.show_create_modal",
			"cmd.file_editor.open",
			"cmd.file_editor.open_file",
			"cmd.metadata.rename",
			"cmd.application.context_menu.show",
			"cmd.application.command_palette.show",
			"cmd.application.command_palette.hide",
			"cmd.metadata.set_property",
			"cmd.application.notification.show",
		],
		queries: [
			"data.metadata_query",
			"application.current_route",
			"users.users_query",
			"functions.file_associations",
		],
	},
	ctx => {
		const { on, emit } = ctx.get_commands()

		on("cmd.file_editor.open", () => emit("cmd.application.router.navigate", "/editor"))
		on("cmd.file_editor.open_file", x => emit("cmd.application.router.navigate", `/editor/${x}`))

		emit("cmd.application.add_translations", {
			lang: "en",
			translations: {
				"t.file_editor.command_palette.open": "Open File Editor",
				"t.file_editor.command_palette.open_file": "Open in File Editor...",
			},
		})

		// emit("cmd.application.command_palette.add", {
		// 	id: "cmd.file_editor.open",
		// 	on_select: () => emit("cmd.file_editor.open"),
		// 	readable_name: "t.file_editor.command_palette.open",
		// 	accelerator: "mod+e",
		// 	Icon: BsLayoutTextWindow,
		// })

		emit("cmd.functions.activities.register", {
			fid: ctx.fid,
			activity: {
				name: "pink.ordo.editor.activity",
				routes: ["/editor", "/editor/:fsid"],
				render_icon: div => {
					div.innerHTML = BS_LAYOUT_TEXT_WINDOW
					return Promise.resolve()
				},
				render_workspace: div => Maoka.render_dom(div, FileEditorWorkspace(ctx)),
				render_sidebar: div => Maoka.render_dom(div, FileEditorSidebar(ctx)),
			},
		})
	},
)
