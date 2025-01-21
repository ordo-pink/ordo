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

import { ContextMenuItemType, Metadata } from "@ordo-pink/core"
import { BsTags } from "@ordo-pink/frontend-icons"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { R } from "@ordo-pink/result"
import { type TMaokaJab } from "@ordo-pink/maoka"

export const edit_file_links_command: TMaokaJab = ({ on_unmount, use }) => {
	const state = use(MaokaOrdo.Context.consume)

	const handle_show_edit_links_palette: Ordo.Command.HandlerOf<"cmd.metadata.show_edit_links_palette"> = fsid => {
		const current_links = state.metadata_query
			.get_by_fsid(fsid)
			.pipe(R.ops.chain(R.FromNullable))
			.pipe(R.ops.map(metadata => metadata.get_links()))
			.pipe(R.ops.chain(links => R.Merge(links.flatMap(link => state.metadata_query.get_by_fsid(link)))))
			.cata(R.catas.or_else(() => [] as Ordo.Metadata.Instance[]))

		const available_links = state.metadata_query
			.get()
			.pipe(
				R.ops.map(ls =>
					ls.filter(l => l.get_fsid() !== fsid && !current_links.some(link => l.get_fsid() === link?.get_fsid())),
				),
			)
			.cata(R.catas.or_else(() => [] as Ordo.Metadata.Instance[]))

		state.commands.emit("cmd.application.command_palette.show", {
			max_items: 200,
			is_multiple: true,
			on_select: item => state.commands.emit("cmd.metadata.add_links", { fsid, links: [item.value.get_fsid()] }),
			on_deselect: item => state.commands.emit("cmd.metadata.remove_links", { fsid, links: [item.value.get_fsid()] }),
			items: available_links.map(link => ({
				value: link,
				readable_name: link.get_name() as Ordo.I18N.TranslationKey,
			})),
			pinned_items: current_links.map(link => ({
				value: link,
				readable_name: link?.get_name() as Ordo.I18N.TranslationKey,
			})),
		})
	}

	state.commands.on("cmd.metadata.show_edit_links_palette", handle_show_edit_links_palette)

	state.commands.emit("cmd.application.context_menu.add", {
		command: "cmd.metadata.show_edit_links_palette",
		render_icon: div => div.appendChild(BsTags() as SVGSVGElement),
		readable_name: "t.common.metadata.show_edit_links_palette",
		should_show: ({ payload }) => Metadata.Validations.is_metadata(payload),
		payload_creator: ({ payload }) => (Metadata.Validations.is_metadata(payload) ? payload.get_fsid() : null),
		type: ContextMenuItemType.CREATE,
	})

	on_unmount(() => {
		state.commands.off("cmd.metadata.show_edit_links_palette", handle_show_edit_links_palette)
		state.commands.emit("cmd.application.context_menu.remove", "cmd.metadata.show_edit_links_palette")
	})
}
