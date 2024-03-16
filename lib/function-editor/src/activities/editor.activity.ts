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

import { BsLayoutSidebar } from "react-icons/bs"
import { lazy } from "react"

import { ORDO_PINK_EDITOR_FUNCTION } from "@ordo-pink/core"

const name = ORDO_PINK_EDITOR_FUNCTION.concat(".activity")

type P = { commands: Client.Commands.Commands }
export const registerEditorActivity = ({ commands }: P) => {
	commands.emit<cmd.activities.add>("activities.add", {
		Component: lazy(() => import("../views/editor.workspace")),
		Sidebar: lazy(() => import("../views/editor.sidebar")),
		Icon: BsLayoutSidebar,
		name,
		routes: ["/editor", "/editor/:fsid"],
		background: false,
	})

	return () => {
		commands.emit<cmd.activities.remove>("activities.remove", name)
	}
}
