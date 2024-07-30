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

import {
	ACTIVITY_BAR_WIDTH,
	SIDEBAR_WORKSPACE_GUTTER_WIDTH,
	TEnabledSidebar,
} from "@ordo-pink/core"
import { Result } from "@ordo-pink/result"

import { use$ } from ".."

export const useWorkspaceWidth = () => {
	const { get_sidebar } = use$.ordo_context()
	const sidebar$ = get_sidebar().cata({ Ok: x => x, Err: () => null })

	const sidebar = use$.strict_subscription(sidebar$, { disabled: true })

	const [document_width, set_document_width] = useState(0)
	const [sizes, set_sizes] = useState<{ sidebar: number; workspace: number }>({
		sidebar: 0,
		workspace: 0,
	})

	useEffect(() => {
		const setTotalWidth = () => set_document_width(window.innerWidth)

		document.addEventListener("resize", setTotalWidth)

		setTotalWidth()

		return () => document.removeEventListener("resize", setTotalWidth)
	}, [])

	useEffect(() => {
		Result.If(!sidebar.disabled, { T: () => sidebar as TEnabledSidebar })
			.pipe(Result.ops.map(sidebar => sidebar.sizes))
			.cata({
				Err: () => {
					set_sizes({ sidebar: 0, workspace: document_width - ACTIVITY_BAR_WIDTH })
				},
				Ok: sizes =>
					set_sizes({
						sidebar:
							((document_width - ACTIVITY_BAR_WIDTH - SIDEBAR_WORKSPACE_GUTTER_WIDTH) * sizes[0]) /
							100,
						workspace:
							((document_width - ACTIVITY_BAR_WIDTH - SIDEBAR_WORKSPACE_GUTTER_WIDTH) * sizes[1]) /
							100,
					}),
			})
	}, [document_width, sidebar])

	return sizes
}
