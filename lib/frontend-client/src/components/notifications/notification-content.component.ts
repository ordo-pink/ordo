import { Maoka } from "@ordo-pink/maoka"

import { NotificationMessage } from "./notification-message.component"
import { NotificationTitle } from "./notification-title.component"

type P = Pick<Client.Notification.Item, "title" | "message">
export const NotificationContent = ({ title, message }: P) =>
	Maoka.create("div", ({ use }) => {
		use(Maoka.hooks.set_class("w-full text-sm"))

		return () => [NotificationTitle({ title }), NotificationMessage({ message })]
	})
