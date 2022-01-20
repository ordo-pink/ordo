import React from "react"
import Split from "react-split"
import { Patch } from "immer"

import { ActivityBar } from "./containers/activity-bar/component"
import { Commander } from "./containers/commander/component"
import { Sidebar } from "./containers/sidebar/component"
import { Workspace } from "./containers/workspace/component"

import { WindowState } from "./common/types"
import { useAppDispatch, useAppSelector } from "./common/store-hooks"
import { applyPatches, setState } from "./common/store"

export const App: React.FC = () => {
	const dispatch = useAppDispatch()

	const sidebarWidth = useAppSelector((state) => state.sidebar.width)

	React.useEffect(() => {
		window.ordo.emit("@application/get-state")
		window.ordo.emit("@commander/get-items", "")
	}, [])

	const handleSetState = ({ detail }: CustomEvent<WindowState>) => {
		dispatch(setState(detail))
	}

	const handlePatchState = ({ detail }: CustomEvent<Patch[]>) => {
		dispatch(applyPatches(detail))
	}

	React.useEffect(() => {
		window.addEventListener("apply-state-patches", handlePatchState as (e: Event) => void)
		window.addEventListener("set-state", handleSetState as (e: Event) => void)

		return () => {
			window.removeEventListener("apply-state-patches", handlePatchState as (e: Event) => void)
			window.removeEventListener("set-state", handleSetState as (e: Event) => void)
		}
	})

	return (
		<div className="flex flex-col h-screen bg-gray-50">
			<div className="fixed w-full flex justify-center">
				<div className="mt-10 w-[50%] bg-white rounded-lg shadow-xl">
					<Commander />
				</div>
			</div>
			<main className="flex flex-grow">
				<ActivityBar />
				<Split
					sizes={[100 - sidebarWidth, sidebarWidth]}
					minSize={0}
					snapOffset={100}
					className="flex select-none w-full"
					onDragEnd={(sizes) => window.ordo.emit("@sidebar/set-width", sizes[1])}
				>
					<div className="w-full">
						<Workspace />
					</div>

					<div>
						<div className="p-2 h-full">
							<div className="shadow-lg rounded-lg h-full p-2 bg-gray-100">
								<Sidebar />
							</div>
						</div>
					</div>
				</Split>
			</main>
		</div>
	)
}
