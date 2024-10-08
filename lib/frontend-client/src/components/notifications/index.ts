import { type Observable } from "rxjs"

import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"

import { Notification } from "./notification.component"

import "./notifications.css"

export const Notifications = (
	ctx: Ordo.CreateFunction.Params,
	$: Observable<Ordo.Notification.Instance[]>,
) =>
	Maoka.create("div", ({ use }) => {
		use(MaokaOrdo.Context.provide(ctx))
		use(MaokaJabs.set_class("notification-list"))

		const get_list = use(MaokaOrdo.Jabs.from$($, [] as Ordo.Notification.Instance[]))

		return () => {
			const notifications = get_list()

			return notifications.map(item => Notification(item))
		}
	})
