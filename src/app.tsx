import React from "react"
import Split from "react-split"

import { ActivityBar } from "./containers/activity-bar/component"
import { NotificationCenter } from "./containers/notification-center/component"
import { Sidebar } from "./containers/sidebar/component"
import { StatusBar } from "./containers/status-bar/component"
import { Workspace } from "./containers/workspace/component"

export const App: React.FC = () => {
	return (
		<div className="flex flex-col h-screen bg-gray-50">
			<main className="flex flex-grow">
				<div>
					<ActivityBar />
				</div>
				<Split sizes={[75, 25]} minSize={0} snapOffset={50} gutterAlign="start" className="flex select-none w-full">
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
			<footer className="flex bg-gray-200 text-sm">
				<div className="flex-grow">
					<StatusBar />
				</div>
				<div>
					<NotificationCenter />
				</div>
			</footer>
		</div>
	)
}
