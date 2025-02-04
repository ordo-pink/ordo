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
import { BsFileEarmarkMinus } from "@ordo-pink/frontend-icons"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { type TMaokaJab } from "@ordo-pink/maoka"

import { RemoveFileModal } from "../../components/remove-file-modal.component"

export const remove_file_command: TMaokaJab = ({ onunmount, use }) => {
	const state = use(MaokaOrdo.Context.consume)

	const handle_show_remove_modal: Ordo.Command.HandlerOf<"cmd.metadata.show_remove_modal"> = fsid => {
		const Modal = MaokaOrdo.Components.WithState(state, () => RemoveFileModal(fsid))

		state.commands.emit("cmd.application.modal.show", { render: () => Modal })
	}

	state.commands.on("cmd.metadata.show_remove_modal", handle_show_remove_modal)

	state.commands.emit("cmd.application.context_menu.add", {
		command: "cmd.metadata.show_remove_modal",
		payload_creator: ({ payload }) => Metadata.Validations.is_metadata(payload) && payload.get_fsid(),
		readable_name: "t.common.components.modals.remove_file.title",
		render_icon: BsFileEarmarkMinus,
		should_show: ({ payload }) => Metadata.Validations.is_metadata(payload),
		type: ContextMenuItemType.DELETE,
	})

	// TODO Command palette item if there is currently selected metadata

	onunmount(() => {
		state.commands.off("cmd.metadata.show_remove_modal", handle_show_remove_modal)
		state.commands.emit("cmd.application.context_menu.remove", "cmd.metadata.show_remove_modal")
	})
}
