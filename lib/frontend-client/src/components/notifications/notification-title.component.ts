import { Maoka } from "@ordo-pink/maoka"
import { O } from "@ordo-pink/option"
import { noop } from "@ordo-pink/tau"

type P = Pick<Ordo.Notification.Instance, "title">
export const NotificationTitle = ({ title }: P) =>
	O.FromNullable(title).cata({ None: noop, Some: () => render_title(title) })

const render_title = (title: Ordo.Notification.Instance["title"]) => Title(() => title)

const Title = Maoka.styled("h4", { class: "font-bold" })
