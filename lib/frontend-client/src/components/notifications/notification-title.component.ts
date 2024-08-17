import { O } from "@ordo-pink/option"
import { create } from "@ordo-pink/maoka"
import { noop } from "@ordo-pink/tau"

const h4 = create("h4")

type P = Pick<Client.Notification.Item, "title">
export const NotificationTitle = ({ title }: P) =>
	O.FromNullable(title).cata({ None: noop, Some: () => render_title(title) })

const render_title = (title: Client.Notification.Item["title"]) =>
	h4({ class: "font-bold" }, () => title)
