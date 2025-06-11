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

import { maoka, maoka_dom } from "@ordo-pink/maoka"
import type { ClientSDK } from "@ordo-pink/sdk-client"
import { maoka_sdk } from "@ordo-pink/sdk-maoka"

type Args = { render_icon: ClientSDK.Activity.RenderIcon; is_current: boolean; readable_name: ClientSDK.Translations.Key }

export const activity_bar_icon = maoka.create<Args>("span", ({ use, is_current, render_icon, readable_name }) => {
	const t_readable_name = use(maoka_sdk.jabs.translate$(readable_name))

	use(maoka_sdk.jabs.classes.set("activity-bar_icon"))
	if (is_current) use(maoka_sdk.jabs.classes.add("active"))
	else use(maoka_sdk.jabs.classes.remove("active"))

	use(maoka_dom.jabs.if_dom(n => void render_icon(n.value)))

	return () => {
		use(maoka_sdk.jabs.set_attribute("title", t_readable_name()))
	}
})
