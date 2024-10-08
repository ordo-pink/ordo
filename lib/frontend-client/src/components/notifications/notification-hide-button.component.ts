import { BS_X } from "@ordo-pink/frontend-icons"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"

import { get_readable_type } from "./common"

type P = Pick<Ordo.Notification.Instance, "id" | "type">
export const NotificationHideButton = ({ id, type }: P) =>
	Maoka.create("button", ({ use }) => {
		const commands = use(MaokaOrdo.Jabs.Commands)
		const readable_type = get_readable_type(type)

		use(MaokaJabs.set_inner_html(BS_X))
		use(MaokaJabs.set_class("notification-card_close", readable_type))
		use(MaokaJabs.listen("onclick", event => handle_click(event)))

		const handle_click = (event: MouseEvent) => {
			event.preventDefault()
			event.stopPropagation()

			commands.emit("cmd.application.notification.hide", id)
		}
	})
