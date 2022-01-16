import React from "react"
import { HiOutlineBell, HiOutlineShare } from "react-icons/hi"
import { StatusBarItem } from "./status-bar-item"

export const StatusBar: React.FC = () => (
	<div className="flex items-center justify-between">
		<div></div>
		<div className="flex">
			<StatusBarItem icon={HiOutlineShare} text="Notification" show={true} description="Leave Feedback" />
			<StatusBarItem icon={HiOutlineBell} show={true} description="Notifications" />
		</div>
	</div>
)
