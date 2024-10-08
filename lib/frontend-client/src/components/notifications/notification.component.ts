import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { noop } from "@ordo-pink/tau"

import { NotificationHideButton } from "./notification-hide-button.component"
import { NotificationIcon } from "./notification-icon.component"
import { NotificationProgress } from "./notification-progress.component"
import { get_readable_type } from "./common"

type P = Ordo.Notification.Instance
export const Notification = ({ on_click, id, message, duration, render_icon, title, type }: P) => {
	return Maoka.create("div", ({ use }) => {
		use(MaokaJabs.set_class("notification-card_container"))

		const { t } = use(MaokaOrdo.Jabs.Translations)

		if (on_click) {
			use(MaokaJabs.add_class("interactive"))
			use(MaokaJabs.listen("onclick", on_click))
		} else {
			use(MaokaJabs.remove_class("interactive"))
			use(MaokaJabs.listen("onclick", noop))
		}

		const card_type = get_readable_type(type)
		const NotificationCard = create_notification_card(card_type)

		return () =>
			NotificationCard(() => [
				NotificationIcon({ render_icon, type }),
				NotificationCardBody(() => [
					title ? NotificationTitle(() => t(title)) : void 0,
					NotificationMessage(() => t(message)),
				]),
				NotificationProgress({ id, duration, type }),
				NotificationHideButton({ id, type }),
			])
	})
}

// --- Internal ---

const create_notification_card = (card_type: string) =>
	Maoka.styled("div", { class: `notification-card ${card_type}` })

const NotificationCardBody = Maoka.styled("div", { class: "notification-card_body" })

const NotificationMessage = Maoka.styled("p")

const NotificationTitle = Maoka.styled("h2", { class: "notification-card_title" })
