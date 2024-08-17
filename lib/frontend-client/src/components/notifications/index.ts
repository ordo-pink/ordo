import { type TOrdoHooks } from "@ordo-pink/maoka-ordo-hooks"
import { create } from "@ordo-pink/maoka"

import { Notification } from "./notification.component"
import { TNotificationsHook } from "../../hooks/use-notifications.hook"

const div = create<TOrdoHooks & TNotificationsHook>("div")

export const Notifications = div(use => {
	use.set_class("flex flex-col gap-y-1")

	const notifications = use.get_notifications()

	return notifications.map(Notification)
})
