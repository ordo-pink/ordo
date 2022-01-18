import React from "react"
import Split from "react-split"
import { useImmer } from "use-immer"
import { applyPatches, Patch } from "immer"

import { ActivityBar } from "./containers/activity-bar/component"
import { Commander } from "./containers/commander/component"
import { Sidebar } from "./containers/sidebar/component"
import { Workspace } from "./containers/workspace/component"

import commander from "./containers/commander/initial-state"
import activities from "./containers/activity-bar/initial-state"
import sidebar from "./containers/sidebar/initial-state"

export const App: React.FC = () => {
	const [state, setState] = useImmer({
		activities,
		commander,
		sidebar,
	})

	const handlePatchState = ({ detail }: CustomEvent<Patch[]>) => {
		setState(applyPatches(state, detail))
	}

	React.useEffect(() => {
		window.addEventListener("patch-state", handlePatchState as (e: Event) => void)

		return () => {
			window.removeEventListener("patch-state", handlePatchState as (e: Event) => void)
		}
	})

	return (
		<div className="flex flex-col h-screen bg-gray-50">
			{state.commander.show ? (
				<div className="fixed w-full flex justify-center">
					<div className="mt-10 w-[50%] bg-white rounded-lg shadow-xl">
						<Commander show={state.commander.show} items={state.commander.items} />
					</div>
				</div>
			) : null}
			<main className="flex flex-grow">
				<ActivityBar
					show={state.activities.show}
					topItems={state.activities.topItems}
					bottomItems={state.activities.bottomItems}
				/>
				<Split
					sizes={[100 - state.sidebar.width, state.sidebar.width]}
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
								<Sidebar show={state.sidebar.show} width={state.sidebar.width} component={state.sidebar.component} />
							</div>
						</div>
					</div>
				</Split>
			</main>
		</div>
	)
}
