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
import { MaokaJabs } from "@ordo-pink/maoka-jabs"

type P = Required<Pick<Ordo.Activity.Instance, "name" | "render_icon">> & {
	current_activity_name?: Ordo.Activity.Instance["name"]
}
export const OrdoActivityBarIcon = ({ name, render_icon, current_activity_name }: P) =>
	Maoka.create("span", ({ use }) => {
		const is_current = !!current_activity_name && current_activity_name === name

		use(MaokaJabs.set_class("activity-bar_icon"))

		if (is_current) use(MaokaJabs.add_class("active"))
		else use(MaokaJabs.remove_class("active"))

		return render_icon
	})
