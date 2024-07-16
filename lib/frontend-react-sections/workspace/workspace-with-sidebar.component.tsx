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

import { Suspense, useEffect, useState } from "react"

import Split from "react-split"

import {
	DEFAULT_WORKSPACE_SPLIT_SIZE,
	DEFAULT_WORKSPACE_SPLIT_SIZE_NO_SIDEBAR,
	NARROW_WINDOW_BREAKPOINT,
	type WorkspaceSplitSize,
	sidebar$,
} from "@ordo-pink/frontend-stream-sidebar"
import { useCommands, useStrictSubscription, useWindowSize } from "@ordo-pink/frontend-react-hooks"
import { Either } from "@ordo-pink/either"

import { type OnDragEndFn, type WorkspaceContentProps } from "./workspace.types"

import Sidebar from "./sidebar.component"

export default function WorkspaceWithSidebar({ activity }: WorkspaceContentProps) {
	const [windowWidth] = useWindowSize()
	const sidebar = useStrictSubscription(sidebar$, { disabled: true })
	const commands = useCommands()

	const [isNarrow, setIsNarrow] = useState(true)
	const [sizes, setSizes] = useState<WorkspaceSplitSize>(DEFAULT_WORKSPACE_SPLIT_SIZE_NO_SIDEBAR)

	useEffect(() => {
		const isNarrow = windowWidth < NARROW_WINDOW_BREAKPOINT
		commands.emit<cmd.sidebar.set_size>(
			"sidebar.set-size",
			isNarrow ? DEFAULT_WORKSPACE_SPLIT_SIZE_NO_SIDEBAR : DEFAULT_WORKSPACE_SPLIT_SIZE,
		)

		setIsNarrow(isNarrow)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [windowWidth])

	useEffect(() => {
		if (sidebar.disabled) return
		setSizes(sidebar.sizes)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sidebar])

	const snapOffset = isNarrow ? windowWidth / 2 : windowWidth / 5

	const onDragEnd: OnDragEndFn = ([left, right]) => {
		let newLeft = left
		let newRight = right

		const isNarrowLeftSnappable = isNarrow && left < 50
		const isNarrowRightSnappable = isNarrow && left >= 50

		const isWideLeftSnappable = left < 5
		const isWideRightSnappable = left >= windowWidth - 200

		const isLeftSnappable = isNarrowLeftSnappable || isWideLeftSnappable
		const isRightSnappable = isNarrowRightSnappable || isWideRightSnappable

		if (isLeftSnappable) {
			newLeft = 0
			newRight = 100
		} else if (isRightSnappable) {
			newLeft = 100
			newRight = 0
		}

		commands.emit<cmd.sidebar.set_size>("sidebar.set-size", [newLeft, newRight])
	}

	return Either.fromNullable(activity).fold(
		() => <div>Welcome</div>,
		({ Component, Sidebar: SidebarComponent }) => (
			<Split
				className="flex h-screen w-full overflow-hidden pl-12"
				sizes={sizes}
				snapOffset={snapOffset}
				onDrag={sizes => setSizes(sizes as WorkspaceSplitSize)}
				onDragEnd={onDragEnd}
				minSize={0}
				direction="horizontal"
			>
				<div className={`sidebar h-full ${sizes[0] <= 5 ? "hidden" : "block"}`}>
					<Sidebar isNarrow={isNarrow}>{SidebarComponent && <SidebarComponent />}</Sidebar>
				</div>

				<div className={`workspace size-full ${sizes[1] <= 5 ? "hidden" : "block"} overflow-auto`}>
					<Suspense>
						<Component />
					</Suspense>
				</div>
			</Split>
		),
	)
}
