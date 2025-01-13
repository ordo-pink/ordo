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

import { ContextMenuItemType, LabelColor, Metadata } from "@ordo-pink/core"
import { Maoka, type TMaokaJab } from "@ordo-pink/maoka"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { R } from "@ordo-pink/result"

import { EditLabelModal } from "../../components/edit-label-modal.component"
import { color_class } from "@ordo-pink/maoka-components"

export const edit_file_labels_command: TMaokaJab = ({ on_unmount, use }) => {
	const state = use(MaokaOrdo.Context.consume)

	const handle_show_edit_label_modal: Ordo.Command.HandlerOf<"cmd.metadata.show_edit_label_modal"> = label => {
		const Component = MaokaOrdo.Components.WithState(state, () => EditLabelModal(label))
		state.commands.emit("cmd.application.modal.show", { render: div => void Maoka.render_dom(div, Component) })
	}

	const handle_show_edit_labels_palette: Ordo.Command.HandlerOf<"cmd.metadata.show_edit_labels_palette"> = fsid => {
		const show_labels_palette = () => {
			const cl = state.metadata_query
				.get_by_fsid(fsid)
				.pipe(R.ops.chain(R.FromNullable))
				.pipe(R.ops.map(metadata => metadata.get_labels()))
				.cata(R.catas.or_else(() => [] as Ordo.Metadata.Label[]))

			const available_labels = state.metadata_query
				.get()
				.pipe(R.ops.map(metadata => metadata.flatMap(item => item.get_labels())))
				.pipe(
					R.ops.map(ls =>
						ls.reduce(
							(acc, l) => (acc.some(i => i.name === l.name && i.color === l.color) ? acc : [...acc, l]),
							[] as Ordo.Metadata.Label[],
						),
					),
				)
				.pipe(R.ops.map(ls => ls.filter(l => !cl.some(c_label => c_label.name === l.name && c_label.color === l.color))))
				.cata(R.catas.or_else(() => [] as Ordo.Metadata.Label[]))

			state.commands.emit("cmd.application.command_palette.show", {
				is_multiple: true,
				on_new_item: value => {
					state.commands.emit("cmd.metadata.add_labels", { fsid, labels: [{ name: value, color: LabelColor.DEFAULT }] })
					show_labels_palette()
				},
				items: available_labels.map(label => ({
					readable_name: label.name as Ordo.I18N.TranslationKey,
					on_select: () => state.commands.emit("cmd.metadata.add_labels", { fsid, labels: [label] }),
					render_custom_info: () => LabelCircle(label.color),
				})),
				max_items: 200,
				pinned_items: cl.map(label => ({
					readable_name: label.name as Ordo.I18N.TranslationKey,
					on_select: () => state.commands.emit("cmd.metadata.remove_labels", { fsid, labels: [label] }),
					render_custom_info: () => LabelCircle(label.color),
				})),
			})
		}

		show_labels_palette()
	}

	state.commands.on("cmd.metadata.show_edit_label_modal", handle_show_edit_label_modal)
	state.commands.on("cmd.metadata.show_edit_labels_palette", handle_show_edit_labels_palette)

	state.commands.emit("cmd.application.context_menu.add", {
		command: "cmd.metadata.show_edit_labels_palette",
		// TODO render_icon: div => div.appendChild(BsFileEarmarkPlus() as SVGSVGElement),
		readable_name: "t.common.metadata.show_edit_labels_palette", // TODO
		should_show: ({ payload }) => Metadata.Validations.is_metadata(payload),
		payload_creator: ({ payload }) => (Metadata.Validations.is_metadata(payload) ? payload.get_fsid() : null),
		type: ContextMenuItemType.CREATE,
	})

	on_unmount(() => {
		state.commands.off("cmd.metadata.show_edit_label_modal", handle_show_edit_label_modal)
		state.commands.off("cmd.metadata.show_edit_labels_palette", handle_show_edit_labels_palette)
		state.commands.emit("cmd.application.context_menu.remove", "cmd.metadata.show_edit_labels_palette")
	})
}

const LabelCircle = (color: LabelColor) =>
	Maoka.styled("div", { class: `label ${color_class[color]} size-3 !rounded-full` })(() => {})
