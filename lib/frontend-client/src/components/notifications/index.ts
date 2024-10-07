import { type Observable } from "rxjs"

import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"

import { Notification } from "./notification.component"

export const Notifications = (
	ctx: Ordo.CreateFunction.Params,
	notification$: Observable<Ordo.Notification.Instance[]>,
) =>
	Maoka.create("div", ({ use, refresh }) => {
		use(MaokaOrdo.Context.provide(ctx))
		use(MaokaJabs.set_class("flex flex-col gap-y-1"))

		let notifications: Ordo.Notification.Instance[] = []

		const handle_notification_updates = (new_notifications: Ordo.Notification.Instance[]) => {
			notifications = new_notifications
			void refresh()
		}

		use(MaokaOrdo.Jabs.subscribe(notification$, handle_notification_updates))

		return () => notifications.map(item => Notification(item))
	})
