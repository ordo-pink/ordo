// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"

import { ActivityBarIcon } from "./activity-bar-icon.component"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"

type P = Pick<Ordo.Activity.Instance, "default_route"> &
	Required<Pick<Ordo.Activity.Instance, "render_icon" | "routes" | "name">> & {
		current_activity_name?: Ordo.Activity.Instance["name"]
		on_click?: (event: MouseEvent) => void
	}
export const ActivityBarLink = ({ render_icon, default_route, routes, name, current_activity_name, on_click }: P) =>
	Maoka.create("a", ({ use }) => {
		const activity_link = default_route ?? routes[0]

		use(MaokaJabs.set_class("activity-bar_link"))
		use(MaokaJabs.set_attribute("href", activity_link))
		use(MaokaJabs.listen("onclick", event => handle_click(event)))

		const { emit } = use(MaokaOrdo.Jabs.Commands.get)
		const handle_click = on_click
			? on_click
			: (event: MouseEvent) => {
					event.preventDefault()
					emit("cmd.application.router.navigate", activity_link)
				}

		return () => ActivityBarIcon({ name, render_icon, current_activity_name })
	})
