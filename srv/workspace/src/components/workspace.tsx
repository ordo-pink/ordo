// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { Unary, Nullable } from "@ordo-pink/tau"
import { useState, useEffect } from "react"
import Split from "react-split"
import { Either } from "@ordo-pink/either"
import { useWindowSize } from "../hooks/use-window-size"
import { __CurrentActivity$ } from "../streams/activities"
import { getCommands } from "$streams/commands"
import Sidebar from "./sidebar"
import { __CommandPalette$ } from "$streams/command-palette"
import { __Sidebar$ } from "$streams/sidebar"
import { useStrictSubscription, useSubscription } from "$hooks/use-subscription"
import { Extensions, ComponentSpace, cmd } from "@ordo-pink/frontend-core"

// --- Public ---

const commands = getCommands()

type _P = {
	commandPalette$: Nullable<__CommandPalette$>
	sidebar$: Nullable<__Sidebar$>
	currentActivity$: __CurrentActivity$
}
export default function Workspace({ commandPalette$, sidebar$, currentActivity$ }: _P) {
	const sidebar = useStrictSubscription(sidebar$, { disabled: true })
	const activity = useSubscription(currentActivity$)

	useEffect(() => {
		if (activity?.Sidebar) {
			commands.emit<cmd.sidebar.enable>("sidebar.enable")
		} else {
			commands.emit<cmd.sidebar.disable>("sidebar.disable")
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activity?.Sidebar?.displayName, activity?.name])

	return Either.fromNullable(sidebar)
		.chain(state => Either.fromBoolean(() => !state.disabled).map(() => sidebar$))
		.fold(
			() => <DisabledSidebar activity={activity} />,
			$ => <EnabledSidebar commandPalette$={commandPalette$} sidebar$={$!} activity={activity} />,
		)
}

// --- Internal ---

type OnDragEndFn = Unary<[number, number], void>
type DisabledSidebarProps = { activity: Nullable<Extensions.Activity> }
type EnabledSidebarP = DisabledSidebarProps & {
	sidebar$: __Sidebar$
	commandPalette$: Nullable<__CommandPalette$>
}

const DisabledSidebar = ({ activity }: DisabledSidebarProps) =>
	Either.fromNullable(activity).fold(
		() => <div>Welcome</div>,
		({ Component }) => (
			<div className="workspace w-full h-full overflow-auto pl-12">
				<Component commands={commands} space={ComponentSpace.WORKSPACE} />
			</div>
		),
	)

const EnabledSidebar = ({ sidebar$, activity, commandPalette$ }: EnabledSidebarP) => {
	const [windowWidth] = useWindowSize()
	const sidebar = useStrictSubscription(sidebar$, { disabled: true })

	const [isNarrow, setIsNarrow] = useState(true)
	const [sizes, setSizes] = useState([25, 75])

	useEffect(() => {
		const isNarrow = windowWidth < 768
		commands.emit<cmd.sidebar.setSize>("sidebar.set-size", isNarrow ? [0, 100] : [25, 75])

		setIsNarrow(isNarrow)
	}, [windowWidth])

	useEffect(() => {
		if (sidebar.disabled) return
		setSizes(sidebar.sizes)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [!sidebar.disabled && sidebar.sizes[0]])

	const snapOffset = isNarrow ? windowWidth / 2 : 200

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

		commands.emit<cmd.sidebar.setSize>("sidebar.set-size", [newLeft, newRight])
	}

	return Either.fromNullable(activity).fold(
		() => <div>Welcome</div>,
		({ Component, Sidebar: SidebarComponent }) => (
			<Split
				className="flex overflow-hidden h-screen w-full pl-12"
				sizes={sizes}
				snapOffset={snapOffset}
				onDrag={setSizes}
				onDragEnd={onDragEnd}
				minSize={0}
				direction="horizontal"
			>
				<div className={`sidebar h-full ${sizes[0] <= 5 ? "hidden" : "block"}`}>
					<Sidebar sidebar$={sidebar$} commandPalette$={commandPalette$} isNarrow={isNarrow}>
						{SidebarComponent && <SidebarComponent />}
					</Sidebar>
				</div>

				<div
					className={`workspace h-full w-full ${sizes[1] <= 5 ? "hidden" : "block"} overflow-auto`}
				>
					<Component commands={commands} space={ComponentSpace.WORKSPACE} />
				</div>
			</Split>
		),
	)
}
