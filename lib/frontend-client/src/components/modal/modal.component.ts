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

import { ModalCloseButton } from "./close-button.component"

export const Modal = (modal: Ordo.Modal.Instance | null) =>
	Maoka.create("div", ({ use, element: current_element }) => {
		use(MaokaJabs.set_class("modal"))
		use(MaokaJabs.listen("onclick", event => handle_click(event)))

		if (modal) void modal.render(current_element as unknown as HTMLDivElement)

		const handle_click = (event: MouseEvent) => {
			if (!modal) return
			event.stopPropagation()
		}

		return () => {
			if (modal) use(MaokaJabs.add_class("active"))
			else use(MaokaJabs.remove_class("active"))

			return ModalCloseButton(modal)
		}
	})
