import type { Unary, Nullable } from "#lib/tau/mod"

import { useState, useEffect } from "react"
import Split from "react-split"
import { Either } from "#lib/either/mod"
import { useWindowSize } from "../hooks/use-window-size"
import { useCurrentActivity, Activity } from "../streams/extensions"
import { useSidebar, SidebarState } from "../streams/sidebar"
import { executeCommand } from "../streams/commands"
import Sidebar from "./sidebar"

// TODO: Render Welcome page if activity is null

// --- Public ---

export default function Workspace() {
	const sidebar = useSidebar()
	const activity = useCurrentActivity()

	return Either.fromNullable(sidebar)
		.chain(state => Either.fromBoolean(() => !state.disabled))
		.fold(
			() => <DisabledSidebar activity={activity} />,
			() => <EnabledSidebar sidebar={sidebar} activity={activity} />
		)
}

// --- Internal ---

type OnDragEndFn = Unary<[number, number], void>
type DisabledSidebarProps = { activity: Nullable<Activity> }
type EnabledSidebarProps = DisabledSidebarProps & { sidebar: SidebarState }

const DisabledSidebar = ({ activity }: DisabledSidebarProps) =>
	Either.fromNullable(activity).fold(
		() => <div>Welcome</div>,
		({ Component }) => (
			<div className="max-h-screen h-full flex overflow-auto w-full">
				<Component />
			</div>
		)
	)

const EnabledSidebar = ({ sidebar, activity }: EnabledSidebarProps) => {
	const [windowWidth] = useWindowSize()

	const [isNarrow, setIsNarrow] = useState(true)
	const [sizes, setSizes] = useState([25, 75])

	useEffect(() => {
		const isNarrow = windowWidth < 768
		executeCommand("sidebar.set-size", isNarrow ? [0, 100] : [25, 75])

		setIsNarrow(isNarrow)
	}, [windowWidth])

	useEffect(() => {
		if (sidebar.disabled) return
		setSizes(sidebar.sizes)
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

		executeCommand("sidebar.set-size", [newLeft, newRight])
	}

	return Either.fromNullable(activity).fold(
		() => <div>Welcome</div>,
		({ Component }) => (
			<Split
				className="flex overflow-hidden h-screen w-full"
				sizes={sizes}
				snapOffset={snapOffset}
				onDrag={setSizes}
				onDragEnd={onDragEnd}
				minSize={0}
				direction="horizontal"
			>
				<div className={`h-full ${sizes[0] <= 5 ? "hidden" : "block"}`}>
					<Sidebar isNarrow={isNarrow} />
				</div>

				<div className={`h-full w-full ${sizes[1] <= 5 ? "hidden" : "block"}`}>
					<Component />
				</div>
			</Split>
		)
	)
}
