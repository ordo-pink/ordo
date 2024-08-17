import { type TOrdoHooks } from "@ordo-pink/maoka-ordo-hooks"
import { create } from "@ordo-pink/maoka"

import { NotificationContent } from "./notification-content.component"
import { NotificationHideButton } from "./notification-hide-button.component"
import { NotificationIcon } from "./notification-icon.component"
import { NotificationProgress } from "./notification-progress.component"
import { get_card_class } from "./common"

const div = create<TOrdoHooks>("div")

type P = Client.Notification.Item
export const Notification = ({ on_click, id, message, duration, icon, title, type }: P) => {
	return div(use => {
		use.set_class("relative inset-x-0 z-50 size-full")

		if (on_click) {
			use.add_class("cursor-pointer select-none")
			use.set_listener("onclick", on_click)
		}

		return div(use => {
			use.set_class(
				"flex w-full max-w-lg items-center gap-x-4 rounded-lg px-4 py-2 shadow-sm",
				get_card_class(type),
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
