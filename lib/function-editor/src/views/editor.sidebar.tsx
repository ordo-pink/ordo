// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { BsCalendar2, BsChevronDown, BsListNested } from "react-icons/bs"
import { MouseEvent, useEffect, useState } from "react"

import { FSID, PlainData } from "@ordo-pink/data"
import {
	useChildren,
	useCommands,
	useData,
	useRouteParams,
	useWorkspaceWidth,
} from "@ordo-pink/frontend-react-hooks"
import { Either } from "@ordo-pink/either"
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
		Either.fromNullable(data)
			.chain(data =>
				Either.fromBoolean(
					() => data.length > 0,
					() => data,
				),
			)
			.map(data =>
				isNestingEnabled
					? data.filter(item => item.parent === null)
					: data.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1)),
			)
			.fold(() => setVisibleItems([]), setVisibleItems)
	}, [data, data.length, isNestingEnabled])

	return Either.fromNullable(visibleItems).fold(Loading, data => (
		<div className="p-1 h-full">
			<div className="flex justify-center items-center pb-4 space-x-4">
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
			{Either.fromBoolean(() => !isCollapsed)
				.chain(() => Either.fromBoolean(() => children.length > 0))
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