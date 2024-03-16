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

import { useEffect, useState } from "react"

import { ACTIVITY_BAR_WIDTH, SIDEBAR_WORKSPACE_GUTTER_WIDTH } from "@ordo-pink/core"
import { EnabledSidebar, sidebar$ } from "@ordo-pink/frontend-stream-sidebar"
import { Either } from "@ordo-pink/either"

import { useStrictSubscription } from "./use-strict-subscription.hook"

export const useWorkspaceWidth = () => {
	const sidebar = useStrictSubscription(sidebar$, { disabled: true })

	const [documentWidth, setDocumentWidth] = useState(0)
	const [sizes, setSizes] = useState<{ sidebarWidth: number; workspaceWidth: number }>({
		sidebarWidth: 0,
		workspaceWidth: 0,
	})

	useEffect(() => {
		const setTotalWidth = () => setDocumentWidth(window.innerWidth)

		document.addEventListener("resize", setTotalWidth)

		setTotalWidth()

		return () => document.removeEventListener("resize", setTotalWidth)
	}, [])

	useEffect(() => {
		Either.fromBoolean(
			() => !sidebar.disabled,
			() => sidebar as EnabledSidebar,
		)
			.map(sidebar => sidebar.sizes)
			.fold(
				() => {
					setSizes({ sidebarWidth: 0, workspaceWidth: documentWidth - ACTIVITY_BAR_WIDTH })
				},
				sizes =>
					setSizes({
						sidebarWidth:
							((documentWidth - ACTIVITY_BAR_WIDTH - SIDEBAR_WORKSPACE_GUTTER_WIDTH) * sizes[0]) /
							100,
						workspaceWidth:
							((documentWidth - ACTIVITY_BAR_WIDTH - SIDEBAR_WORKSPACE_GUTTER_WIDTH) * sizes[1]) /
							100,
					}),
			)
	}, [documentWidth, sidebar])

	return sizes
}
