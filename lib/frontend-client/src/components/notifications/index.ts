import { type Observable } from "rxjs"

import { OrdoHooks, ordo_context } from "@ordo-pink/maoka-ordo-hooks"
import { Maoka } from "@ordo-pink/maoka"
import { type TCreateFunctionContext } from "@ordo-pink/core"

import { Notification } from "./notification.component"

export const Notifications = (
	ctx: TCreateFunctionContext,
	notification$: Observable<Client.Notification.Item[]>,
) =>
	Maoka.create("div", ({ use, refresh }) => {
		let notifications: Client.Notification.Item[] = []

		const handle_notification_updates = (new_notifications: Client.Notification.Item[]) => {
			notifications = new_notifications
			refresh()
		}

		use(ordo_context.provide(ctx))
		use(Maoka.hooks.set_class("flex flex-col gap-y-1"))
		use(OrdoHooks.subscription(notification$, handle_notification_updates))

		return () => notifications.map(item => Notification(item))
	})
