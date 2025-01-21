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
import { Maoka, type TMaokaJab } from "@ordo-pink/maoka"
import { BsFileEarmarkPlus } from "@ordo-pink/frontend-icons"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"

import { CreateFileModal } from "../../components/create-file-modal.component"

export const create_file_command: TMaokaJab = ({ on_unmount, use }) => {
	const state = use(MaokaOrdo.Context.consume)

	const handle_show_create_modal: Ordo.Command.HandlerOf<"cmd.metadata.show_create_modal"> = fsid => {
		const Component = MaokaOrdo.Components.WithState(state, () => CreateFileModal(fsid))
		state.commands.emit("cmd.application.modal.show", { render: div => void Maoka.render_dom(div, Component) })
	}

	state.commands.on("cmd.metadata.show_create_modal", handle_show_create_modal)

	state.commands.emit("cmd.application.context_menu.add", {
		command: "cmd.metadata.show_create_modal",
		render_icon: div => div.appendChild(BsFileEarmarkPlus() as SVGSVGElement), // TODO: Move to icons
		readable_name: "t.common.components.modals.create_file.title",
		should_show: ({ payload }) => Metadata.Validations.is_metadata(payload) || payload === "root",
		payload_creator: ({ payload }) => (Metadata.Validations.is_metadata(payload) ? payload.get_fsid() : null),
		type: ContextMenuItemType.CREATE,
	})

	state.commands.emit("cmd.application.command_palette.add", {
		value: () => state.commands.emit("cmd.metadata.show_create_modal", null),
		hotkey: "mod+shift+c",
		readable_name: "t.common.components.modals.create_file.title",
		render_icon: div => void div.appendChild(BsFileEarmarkPlus() as SVGSVGElement),
	})

	on_unmount(() => {
		state.commands.off("cmd.metadata.show_create_modal", handle_show_create_modal)
		state.commands.emit("cmd.application.context_menu.remove", "cmd.metadata.show_create_modal")
		state.commands.emit("cmd.application.command_palette.remove", "t.common.components.modals.create_file.title")
	})
}
