import { add_class, create, listen, set_class } from "@ordo-pink/maoka"

import { NotificationContent } from "./notification-content.component"
import { NotificationHideButton } from "./notification-hide-button.component"
import { NotificationIcon } from "./notification-icon.component"
import { NotificationProgress } from "./notification-progress.component"
import { get_card_class } from "./common"

type P = Client.Notification.Item
export const Notification = ({ on_click, id, message, duration, icon, title, type }: P) => {
	return create("div", ({ use }) => {
		use(set_class("relative inset-x-0 z-50 size-full"))

		if (on_click) {
			use(add_class("cursor-pointer select-none"))
			use(listen("onclick", on_click))
		}

		return create("div", ({ use }) => {
			use(
				set_class(
					"flex w-full max-w-lg items-center gap-x-4 rounded-lg px-4 py-2 shadow-sm",
					get_card_class(type),
				),
			)

			return [
				NotificationIcon({ icon, type }),
				NotificationContent({ title, message }),
				NotificationProgress({ id, duration, type }),
				NotificationHideButton({ id, type }),
			]
		})
	})
}
