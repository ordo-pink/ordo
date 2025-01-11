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

import { Maoka, type TMaokaElement } from "@ordo-pink/maoka"
import { BsPlus } from "@ordo-pink/frontend-icons"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"

export const DatabaseTableActionsRow = (metadata: Ordo.Metadata.Instance) =>
	Maoka.create("tr", ({ use }) => {
		const { emit } = use(MaokaOrdo.Jabs.get_commands)
		use(MaokaJabs.set_class("border-y database_border-color"))

		return () =>
			Maoka.create("td", ({ use }) => {
				use(MaokaJabs.set_class("px-2 py-1 text-neutral-500 text-sm flex gap-x-1 cursor-pointer"))
				use(MaokaJabs.listen("onclick", () => handle_column_title_click()))

				const handle_column_title_click = () => emit("cmd.metadata.show_create_modal", metadata.get_fsid())

				return () => [
					BsPlus() as TMaokaElement,
					Maoka.create("div", () => () => "New"), // TODO: i18n
				]
			})
	})
