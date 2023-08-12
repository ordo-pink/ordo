import { Hosts } from "./streams/auth"
import { useAppInit } from "./hooks/use-app-init"
import ActivityBar from "./components/activity-bar/activity-bar"
import { useOnAuthenticated } from "./hooks/use-on-authenticated"
import Sidebar from "./components/sidebar"
import { useSidebar } from "./streams/sidebar"
import Split from "react-split"
import { useState, useEffect } from "react"
import { useWindowSize } from "./hooks/use-window-size"
import { executeCommand } from "./streams/commands"
import { Unary } from "#lib/tau/mod"
import Modal from "./components/modal"
import { useDefaultCommandPalette } from "./streams/command-palette"

type OnDragFn = Unary<[number, number], void>
type OnDragEndFn = OnDragFn

export default function App({ id, data, web }: Hosts) {
	useAppInit({ id, data, web })
	useOnAuthenticated({ id, data, web })
	useDefaultCommandPalette()

	const sidebar = useSidebar()
	const [windowWidth] = useWindowSize()

	const [isNarrow, setIsNarrow] = useState(true)
	const [sizes, setSizes] = useState([25, 75])

	const snapOffset = isNarrow ? windowWidth / 2 : 200

	const onDrag: OnDragFn = setSizes
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

	useEffect(() => {
		const isNarrow = windowWidth < 768
		executeCommand("sidebar.set-size", isNarrow ? [0, 100] : [25, 75])

		setIsNarrow(isNarrow)
	}, [windowWidth])

	useEffect(() => {
		if (sidebar.disabled) return
		setSizes(sidebar.sizes)
	}, [!sidebar.disabled && sidebar.sizes[0]])

	return (
		<div className="flex">
			<ActivityBar activities={[{ name: "file-explorer", version: "0.1.0", background: false }]} />
			{sidebar?.disabled ? (
				<div className="max-h-screen h-full flex overflow-auto w-full">NO SIDEBAR</div>
			) : (
				<Split
					className="flex overflow-hidden h-screen w-full"
					sizes={sizes}
					snapOffset={snapOffset}
					onDrag={onDrag}
					onDragEnd={onDragEnd}
					minSize={0}
					direction="horizontal"
				>
					<div className={`h-full ${sizes[0] <= 5 ? "hidden" : "block"}`}>
						<Sidebar isNarrow={isNarrow} />
					</div>

					<div className={`h-full w-full ${sizes[1] <= 5 ? "hidden" : "block"}`}>
						<div>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio alias tenetur tempore.
							Temporibus porro commodi, beatae quae, fugiat ratione iure similique iste dolor,
							facilis minus? Debitis magnam culpa dolorum nihil!
						</div>
					</div>
				</Split>
			)}

			<Modal />
		</div>
	)
}
