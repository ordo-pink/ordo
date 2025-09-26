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

import { client_maoka } from "@ordo-pink/sdk-client-maoka"
import { create_component } from "@ordo-pink/oss-maoka"

/**
 * Title div watches for "title.set_title" shots and makes changes to the DOM. This behavior is extracted into
 * a separate Maoka component to avoid redundant rerenders of higher level DOM nodes in case the `t$` jab triggers
 * a refresh due to changes in translations.
 */
export const title = create_component.create("div", ({ use }) => {
	const { hunter } = use(client_maoka.context.consume)
	const translate = use(client_maoka.jabs.t$)
	const title_element = document.querySelector("title")

	hunter.track("title.set_title", title => {
		if (title_element) {
			const title_str = title ? translate(title, "404") : "404"

			title_element.innerHTML = `${title_str} | Ordo.pink`
		}
	})
})
