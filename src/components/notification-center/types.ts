import React from "react"

export type Notification = {
	text: string
	type: "error" | "warning" | "info" | "success"
	onClick: (e: React.MouseEvent<HTMLDivElement>) => void | Promise<void>
}

export type NotificationCenterState = {
	show: boolean
	enable: boolean
	collapsed: boolean
}
