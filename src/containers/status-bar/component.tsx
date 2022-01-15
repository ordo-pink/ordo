import React from "react"
import { NotificationCenter } from "../../components/notification-center/component"
import { ShareMenu } from "../../components/share/component"

export const StatusBar: React.FC = () => (
	<div className="flex items-center justify-between px-4">
		<div></div>
		<div className="flex">
			<div className="px-4 py-1 hover:bg-gray-200 cursor-pointer">
				<ShareMenu />
			</div>
			<div className="px-4 py-1 hover:bg-gray-200 cursor-pointer">
				<NotificationCenter />
			</div>
		</div>
	</div>
)
