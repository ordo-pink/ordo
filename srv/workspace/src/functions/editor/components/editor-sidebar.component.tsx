// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import ActionListItem from "$components/action-list-item"
import { OrdoButtonPrimary } from "$components/buttons/buttons"
import { Loading } from "$components/loading/loading"
import Null from "$components/null"
import FileIconComponent from "$functions/file-explorer/components/file-icon.component"
import { useChildren } from "$hooks/use-children"
import { useData } from "$hooks/use-data.hook"
import { useRouteParams } from "$hooks/use-route-params.hook"
import { useWorkspaceWidth } from "$hooks/use-workspace-width.hook"
import { FSID, PlainData } from "@ordo-pink/data"
import { Either } from "@ordo-pink/either"
import { useSharedContext } from "@ordo-pink/frontend-core"
import { Switch } from "@ordo-pink/switch"
import { MouseEvent, useEffect, useState } from "react"
import { BsCalendar2, BsChevronDown, BsListNested } from "react-icons/bs"

export default function EditorSidebar() {
	const { commands } = useSharedContext()
	const { fsid } = useRouteParams<{ fsid: FSID }>()
	const data = useData()
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
	}, [data?.length, isNestingEnabled])

	return Either.fromNullable(visibleItems).fold(Loading, data => (
		<div className="h-full p-1">
			<div className="flex items-center justify-center space-x-4 pb-4">
				<OrdoButtonPrimary onClick={() => setIsNestingEnables(true)} inverted={!isNestingEnabled}>
					<BsListNested />
				</OrdoButtonPrimary>

				<OrdoButtonPrimary onClick={() => setIsNestingEnables(false)} inverted={isNestingEnabled}>
					<BsCalendar2 />
				</OrdoButtonPrimary>
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
	const { commands } = useSharedContext()
	const { sidebarWidth } = useWorkspaceWidth()

	const isDateVisible = sidebarWidth > 250

	return (
		<ActionListItem
			large
			Icon={() => <FileIconComponent plain={item} />}
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
	const { commands } = useSharedContext()
	const { fsid } = useRouteParams<{ fsid: FSID }>()
	const children = useChildren(item)
	const [isCollapsed, setIsCollapsed] = useState(true)
	const style = depth > 0 ? { paddingLeft: `${20 * depth}px` } : {}

	return (
		<ActionListItem
			Icon={() => <FileIconComponent plain={item} />}
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
