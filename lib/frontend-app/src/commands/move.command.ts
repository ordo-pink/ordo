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

import { BsFilesAlt, BsSlash } from "@ordo-pink/frontend-icons"
import { ContextMenuItemType, Metadata } from "@ordo-pink/core"
import { R, type TResult } from "@ordo-pink/result"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { MetadataIcon } from "@ordo-pink/maoka-components"

/**
 * Register `Move...` command in {@link Ordo.ContextMenu.Item Context Menu} of a
 * {@link Ordo.Metadata.Instance}. The `Move...` command is essentially a setter for
 * the metadata parent value.
 */
export const register_move_command = (ctx: Ordo.CreateFunction.State) => {
	const { commands, metadata_query } = ctx

	const handle_show_move_palette = (fsid: Ordo.Metadata.FSID) =>
		metadata_query
			.get()
			.pipe(R.ops.chain(get_descendents(fsid, metadata_query)))
			.pipe(R.ops.map(filter_destinations(fsid, metadata_query)))
			.pipe(R.ops.map(metadata_to_cp_items(fsid, ctx, commands)))
			.pipe(R.ops.chain(unshift_move_to_root_r(fsid, metadata_query, commands)))
			.pipe(R.ops.map(show_command_palette(commands)))
			.cata(R.catas.or_nothing())

	commands.on("cmd.metadata.show_move_palette", handle_show_move_palette)

	commands.emit("cmd.application.context_menu.add", {
		command: "cmd.metadata.show_move_palette",
		payload_creator: ({ payload }) => (payload as Ordo.Metadata.Instance).get_fsid(),
		readable_name: "t.file_explorer.modals.move.title",
		render_icon: div => div.appendChild(BsFilesAlt() as SVGSVGElement),
		should_show: ({ payload }) => Metadata.Validations.is_metadata(payload),
		type: ContextMenuItemType.UPDATE,
	})

	return () => {
		commands.off("cmd.metadata.show_move_palette", handle_show_move_palette)
		commands.emit("cmd.application.context_menu.remove", "cmd.metadata.show_move_palette")
	}
}

// --- Internal ---

const get_descendents =
	(fsid: Ordo.Metadata.FSID, metadata_query: Ordo.Metadata.Query) =>
	<$THead>(x: $THead): TResult<[$THead, Ordo.Metadata.Instance[]], Ordo.Rrr<"EPERM" | "EINVAL" | "ENOENT" | "EAGAIN">> =>
		metadata_query.get_descendents(fsid).pipe(R.ops.map(descendents => [x, descendents]))

const filter_destinations =
	(fsid: Ordo.Metadata.FSID, metadata_query: Ordo.Metadata.Query) =>
	([all_metadata, descendents]: [Ordo.Metadata.Instance[], Ordo.Metadata.Instance[]]) =>
		all_metadata.filter(
			metadata =>
				metadata.get_fsid() !== fsid &&
				!metadata_query.has_child(metadata.get_fsid(), fsid).cata(R.catas.or_else(() => false)) &&
				!descendents.some(metadata.equals),
		)

const unshift_move_to_root_r =
	(fsid: Ordo.Metadata.FSID, metadata_query: Ordo.Metadata.Query, commands: Ordo.Command.Commands) =>
	(items: Ordo.CommandPalette.Item[]): TResult<Ordo.CommandPalette.Item[], Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL">> =>
		metadata_query
			.get_by_fsid(fsid)
			.pipe(R.ops.map(metadata => (metadata?.is_root_child() ? items : [create_to_root_item(fsid, commands), ...items])))

const create_to_root_item = (fsid: Ordo.Metadata.FSID, commands: Ordo.Command.Commands): Ordo.CommandPalette.Item => ({
	render_icon: div => void div.appendChild(BsSlash() as SVGSVGElement),
	on_select: () => commands.emit("cmd.metadata.move", { fsid, new_parent: null }),
	readable_name: "t.file_explorer.modals.move.move_to_root",
})

const show_command_palette = (commands: Ordo.Command.Commands) => (items: Ordo.CommandPalette.Item[]) =>
	commands.emit("cmd.application.command_palette.show", { is_multiple: false, items, max_items: 100 })

const metadata_to_cp_items =
	(fsid: Ordo.Metadata.FSID, ctx: Ordo.CreateFunction.State, commands: Ordo.Command.Commands) =>
	(move_destinations: Ordo.Metadata.Instance[]) =>
		move_destinations.map(metadata => {
			const new_parent = metadata.get_fsid()
			const readable_name = metadata.get_name() as Ordo.I18N.TranslationKey
			const Icon = MaokaOrdo.Components.WithState(ctx, () => MetadataIcon({ metadata, show_emoji_picker: false }))

			const on_select = () => commands.emit("cmd.metadata.move", { fsid, new_parent })
			const render_icon = (div: HTMLDivElement) => Maoka.render_dom(div, Icon)

			return { on_select, readable_name, render_icon }
		})
