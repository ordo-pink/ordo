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

import { ContextMenuItemType, Metadata } from "@ordo-pink/core"
import { BsFileEarmarkMinus } from "@ordo-pink/frontend-icons"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"

import { RemoveFileModal } from "../components/remove-file-modal.component"

/**
 * Register `Remove` command in {@link Ordo.ContextMenu.Item Context Menu} of a
 * {@link Ordo.Metadata.Instance}. The `Remove` command is irreversible.
 */
export const register_remove_file = (ctx: Ordo.CreateFunction.Params) => {
	const commands = ctx.get_commands()

	commands.on("cmd.metadata.show_remove_modal", fsid => {
		const Modal = MaokaOrdo.Components.WithState(ctx, () => RemoveFileModal(fsid))

		commands.emit("cmd.application.modal.show", { render: div => Maoka.render_dom(div, Modal) })
	})

	commands.emit("cmd.application.context_menu.add", {
		command: "cmd.metadata.show_remove_modal",
		payload_creator: ({ payload }) => Metadata.Validations.is_metadata(payload) && payload.get_fsid(),
		readable_name: "t.file_explorer.modals.remove_file.title",
		render_icon: div => div.appendChild(BsFileEarmarkMinus() as SVGSVGElement),
		should_show: ({ payload }) => Metadata.Validations.is_metadata(payload),
		type: ContextMenuItemType.DELETE,
	})
}
