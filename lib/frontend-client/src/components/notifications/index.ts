import { type Observable } from "rxjs"

import { create, set_class } from "@ordo-pink/maoka"
import { ordo_context, rx_subscription } from "@ordo-pink/maoka-ordo-hooks"
import { type TCreateFunctionContext } from "@ordo-pink/core"

import { Notification } from "./notification.component"

export const Notifications = (
	ctx: TCreateFunctionContext,
	notification$: Observable<Client.Notification.Item[]>,
) =>
	create("div", ({ use }) => {
		use(ordo_context.provide(ctx))
		use(set_class("flex flex-col gap-y-1"))

		const notifications = use(rx_subscription(notification$, "notifications", []))

		return notifications.map(item => Notification(item))
	})
