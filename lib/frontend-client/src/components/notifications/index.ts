import { type Observable } from "rxjs"

import { OrdoHooks, ordo_context } from "@ordo-pink/maoka-ordo-hooks"
import { Maoka } from "@ordo-pink/maoka"

import { Notification } from "./notification.component"

export const Notifications = (
	ctx: Ordo.CreateFunction.Params,
	notification$: Observable<Ordo.Notification.Instance[]>,
) =>
	Maoka.create("div", ({ use, refresh }) => {
		let notifications: Ordo.Notification.Instance[] = []

		const handle_notification_updates = (new_notifications: Ordo.Notification.Instance[]) => {
			notifications = new_notifications
			refresh()
		}

		use(ordo_context.provide(ctx))
		use(Maoka.hooks.set_class("flex flex-col gap-y-1"))
		use(OrdoHooks.subscription(notification$, handle_notification_updates))

		return () => notifications.map(item => Notification(item))
	})
