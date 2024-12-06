/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2024  谢尔盖 ||↓ and the Ordo.pink contributors
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

import { Maoka } from "@ordo-pink/maoka"
// import { MaokaJabs } from "@ordo-pink/maoka-jabs"
// import { Switch } from "@ordo-pink/switch"
// import { is_nan } from "@ordo-pink/tau"

// import { FileExplorerFile } from "./file-explorer-file.component"
// import { ordo_context, OrdoHooks } from "@ordo-pink/maoka-ordo-jabs"

export const FileExplorer = (/*ctx: Ordo.CreateFunction.Params*/) => Maoka.styled("div", {})(() => "")
// Maoka.create("div", ({ use, on_unmount }) => {
// 	use(ordo_context.provide(ctx))

// 	use(MaokaHooks.set_class("h-full overflow-y-hidden"))

// 	const commands = use(OrdoHooks.commands)
// 	const { fsid } = use(get_route_params<{ fsid: FSID }>)
// 	const ancestors = use(get_metadata_ancestors(fsid))
// 	const metadata = use(get_metadata_by_fsid(fsid))

// 	const path = Switch.OfTrue()
// 		.case(ancestors.length > 0, () =>
// 			metadata!
// 				.get_name()
// 				.concat(" / ")
// 				.concat(ancestors.map(ancestor => ancestor.get_name()).join(" / ")),
// 		)
// 		.case(!!metadata, () => `${metadata?.get_name()}`)
// 		.default(() => "/")

// 	const children = use(get_metadata_children(fsid)).sort((a, b) => {
// 		const a_as_number = Number.parseInt(a.get_name(), 10)
// 		if (!is_nan(a_as_number)) {
// 			const b_as_number = Number.parseInt(b.get_name(), 10)
// 			return a_as_number < b_as_number ? -1 : 1
// 		}

// 		return a.get_name().localeCompare(b.get_name())
// 	})

// 	commands.emit("cmd.application.set_title", {
// 		status_bar_title: path,
// 		window_title: `${path} | File Explorer`,
// 	})

// 	return create("div", ({ use }) => {
// 		const context_menu_listener = listen("oncontextmenu", event => {
// 			event.preventDefault()

// 			commands.emit("cmd.application.context_menu.show", {
// 				event: event as any,
// 				payload: metadata ?? "root",
// 				hide_delete_items: !metadata,
// 				hide_update_items: !metadata,
// 				hide_read_items: !metadata,
// 			})
// 		})

// 		use(set_class("h-full overflow-y-auto p-4"))
// 		use(context_menu_listener)

// 		return () =>
// 			create("div", ({ use }) => {
// 				use(set_class("flex gap-2 flex-wrap"))

// 				return children.map(child => FileExplorerFile(child))
// 			})
// 	})
// })
