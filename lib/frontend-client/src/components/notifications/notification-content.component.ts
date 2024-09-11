import { create, set_class } from "@ordo-pink/maoka"

import { NotificationMessage } from "./notification-message.component"
import { NotificationTitle } from "./notification-title.component"

type P = Pick<Client.Notification.Item, "title" | "message">
export const NotificationContent = ({ title, message }: P) =>
	create("div", ({ use }) => {
		use(set_class("w-full text-sm"))

		return [NotificationTitle({ title }), NotificationMessage({ message })]
	})
