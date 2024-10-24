import { Maoka } from "@ordo-pink/maoka"

import { MaokaHooks } from "@ordo-pink/maoka-hooks"
import { NotificationMessage } from "./notification-message.component"
import { NotificationTitle } from "./notification-title.component"

type P = Pick<Ordo.Notification.Instance, "title" | "message">
export const NotificationContent = ({ title, message }: P) =>
	Maoka.create("div", ({ use }) => {
		use(MaokaHooks.set_class("w-full text-sm"))

		return () => [NotificationTitle({ title }), NotificationMessage({ message })]
	})
