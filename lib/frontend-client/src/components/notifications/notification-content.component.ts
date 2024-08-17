import { create } from "@ordo-pink/maoka"

import { NotificationMessage } from "./notification-message.component"
import { NotificationTitle } from "./notification-title.component"

const div = create("div")

type P = Pick<Client.Notification.Item, "title" | "message">
export const NotificationContent = ({ title, message }: P) =>
	div(use => {
		use.set_class("w-full text-sm")

		return [NotificationTitle({ title }), NotificationMessage({ message })]
	})
