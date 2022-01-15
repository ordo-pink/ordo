import React from "react"
import Split from "react-split"

import { ActivityBar } from "./containers/activity-bar/component"
import { Commander } from "./containers/commander/component"
import { Sidebar } from "./containers/sidebar/component"
import { StatusBar } from "./containers/status-bar/component"
import { Workspace } from "./containers/workspace/component"

export const App: React.FC = () => {
	return (
		<div className="flex flex-col h-screen bg-gray-50">
			<div className="fixed w-full flex justify-center">
				<div className="mt-10 w-[50%] px-4 py-1 bg-white shadow-sm rounded-lg">
					<Commander />
				</div>
			</div>
			<main className="flex flex-grow">
				<div className="p-2">
					<ActivityBar />
				</div>
				<Split sizes={[75, 25]} minSize={0} snapOffset={100} gutterAlign="start" className="flex select-none w-full">
					<div className="p-2 w-full">
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
			<footer className="flex text-sm items-center text-gray-600">
				<div className="flex-grow">
					<StatusBar />
				</div>
			</footer>
		</div>
	)
}
