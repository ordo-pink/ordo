import { type Observable } from "rxjs"

import { type TInitHook } from "@ordo-pink/maoka"

export type TNotificationsHook = {
	get_notifications: () => Client.Notification.Item[]
}

export const init_notifications_hook = (
	notification$: Observable<Client.Notification.Item[]>,
): TInitHook<TNotificationsHook> => ({
	get_notifications: use => {
		let notifications = [] as Client.Notification.Item[]

		return () => {
			use.on_mount(() => {
				const subscription = notification$.subscribe(items => {
					notifications = items
					use.refresh()
				})

				return () => {
					subscription.unsubscribe()
				}
			})

			return notifications
		}
	},
})
