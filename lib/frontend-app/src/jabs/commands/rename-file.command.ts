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
import { BsFileEarmarkRichText } from "@ordo-pink/frontend-icons"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { type TMaokaJab } from "@ordo-pink/maoka"

import { RenameFileModal } from "../../components/rename-file-modal.component"

export const rename_file_command: TMaokaJab = ({ onunmount, use }) => {
	const state = use(MaokaOrdo.Context.consume)

	const handle_show_rename_modal: Ordo.Command.HandlerOf<"cmd.metadata.show_rename_modal"> = fsid => {
		const Component = MaokaOrdo.Components.WithState(state, () => RenameFileModal(fsid))
		state.commands.emit("cmd.application.modal.show", { render: () => Component })
	}

	state.commands.on("cmd.metadata.show_rename_modal", handle_show_rename_modal)

	state.commands.emit("cmd.application.context_menu.add", {
		command: "cmd.metadata.show_rename_modal",
		render_icon: BsFileEarmarkRichText,
		readable_name: "t.common.components.modals.rename_file.title",
		should_show: ({ payload }) => Metadata.Validations.is_metadata(payload),
		payload_creator: ({ payload }) => Metadata.Validations.is_metadata(payload) && payload.get_fsid(),
		type: ContextMenuItemType.UPDATE,
	})

	// TODO Command palette item if there is currently selected metadata

	onunmount(() => {
		state.commands.off("cmd.metadata.show_rename_modal", handle_show_rename_modal)
		state.commands.emit("cmd.application.context_menu.hide", "cmd.metadata.show_rename_modal")
	})
}
