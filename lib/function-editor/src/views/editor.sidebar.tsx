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

import { BsCalendar2, BsChevronDown, BsListNested } from "react-icons/bs"
import { MouseEvent, useEffect, useState } from "react"

import { FSID, PlainData } from "@ordo-pink/data"
import { chainE, fromBooleanE, fromNullableE, mapE } from "@ordo-pink/either"
import {
	useChildren,
	useCommands,
	useData,
	useRouteParams,
	useWorkspaceWidth,
} from "@ordo-pink/frontend-react-hooks"
import { Switch } from "@ordo-pink/switch"

import ActionListItem from "@ordo-pink/frontend-react-components/action-list-item"
import DataIcon from "@ordo-pink/frontend-react-components/data-icon/data-icon.component"
import Loading from "@ordo-pink/frontend-react-components/loading-page"
import Null from "@ordo-pink/frontend-react-components/null"
import OrdoButton from "@ordo-pink/frontend-react-components/button"

export default function EditorSidebar() {
	const data = useData()
	const commands = useCommands()
	const { fsid } = useRouteParams<{ fsid: FSID }>()
	const [isNestingEnabled, setIsNestingEnables] = useState(true)
	const [visibleItems, setVisibleItems] = useState<PlainData[]>([])

	useEffect(() => {
		fromNullableE(data)
			.pipe(chainE(data => fromBooleanE(data.length > 0, data)))
			.pipe(
				mapE(data =>
					isNestingEnabled
						? data.filter(item => item.parent === null)
						: data.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1)),
				),
			)
			.fold(() => setVisibleItems([]), setVisibleItems)
	}, [data, data.length, isNestingEnabled])

	return fromNullableE(visibleItems).fold(Loading, data => (
		<div className="h-full p-1">
			<div className="flex items-center justify-center space-x-4 pb-4">
				<OrdoButton.Primary onClick={() => setIsNestingEnables(true)} inverted={!isNestingEnabled}>
					<BsListNested />
				</OrdoButton.Primary>

				<OrdoButton.Primary onClick={() => setIsNestingEnables(false)} inverted={isNestingEnabled}>
					<BsCalendar2 />
				</OrdoButton.Primary>
			</div>
			<div
				className="h-full"
				onContextMenu={event =>
					commands.emit<cmd.ctxMenu.show>("context-menu.show", { event, payload: "root" })
				}
			>
				{data.map(item =>
					Switch.of(isNestingEnabled)
						.case(true, () => <NestedItem key={item.fsid} item={item} depth={0} />)
						.default(() => (
							<PlainListItem key={item.fsid} item={item} isCurrent={fsid === item.fsid} />
						)),
				)}
			</div>
		</div>
	))
}

type PlainListItemP = { item: PlainData; isCurrent: boolean }
const PlainListItem = ({ item, isCurrent }: PlainListItemP) => {
	const commands = useCommands()
	const { sidebarWidth } = useWorkspaceWidth()

	const isDateVisible = sidebarWidth > 250

	return (
		<ActionListItem
			large
			Icon={() => <DataIcon plain={item} />}
			href={`/editor/${item.fsid}`}
			current={isCurrent}
			text={item.name}
			onContextMenu={event =>
				commands.emit<cmd.ctxMenu.show>("context-menu.show", { event, payload: item })
			}
		>
			<div className={`text-xs text-neutral-500 ${isDateVisible ? "block" : "hidden"}`}>
				{new Date(item.updatedAt).toLocaleDateString()}
			</div>
		</ActionListItem>
	)
}

type NestedItemP = { item: PlainData; depth: number }
const NestedItem = ({ item, depth }: NestedItemP) => {
	const commands = useCommands()
	const { fsid } = useRouteParams<{ fsid: FSID }>()
	const children = useChildren(item)
	const [isCollapsed, setIsCollapsed] = useState(true)
	const style = depth > 0 ? { paddingLeft: `${20 * depth}px` } : {}

	return (
		<ActionListItem
			Icon={() => <DataIcon plain={item} />}
			onClick={() => commands.emit<cmd.router.navigate>("router.navigate", `/editor/${item.fsid}`)}
			current={fsid === item.fsid}
			style={style}
			text={item.name}
			onContextMenu={event =>
				commands.emit<cmd.ctxMenu.show>("context-menu.show", { event, payload: item })
			}
		>
			<div className="text-xs text-neutral-500">
				{Switch.of(children.length)
					.case(0, () => null)
					.default(() => (
						<BsChevronDown
							className={`transition-all duration-300 ${isCollapsed ? "rotate-0" : "rotate-180"}`}
							onClick={(event: MouseEvent<SVGElement>) => {
								event.stopPropagation()
								event.preventDefault()
								setIsCollapsed(v => !v)
							}}
						/>
					))}
			</div>
			{fromBooleanE(!isCollapsed)
				.pipe(chainE(() => fromBooleanE(children.length > 0)))
				.fold(Null, () => (
					<div>
						{children.map(child => (
							<NestedItem key={child.fsid} item={child} depth={depth + 1} />
						))}
					</div>
				))}
		</ActionListItem>
	)
}
