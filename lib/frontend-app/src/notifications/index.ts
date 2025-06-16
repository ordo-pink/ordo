import { type Maoka, maoka_dom } from "@ordo-pink/maoka"
import { type ClientSDK } from "@ordo-pink/sdk-client"
import { maoka_sdk } from "@ordo-pink/sdk-maoka"

import { notification_list } from "./components/notifications-list.component"
import { notifications$ } from "./notifications.state"

import "./notifications.styles.css"

export const create_notifications_jab: Maoka.Jab<() => Maoka.Component> = ({ use }) => {
	const { hunter } = use(maoka_sdk.context.consume)

	hunter.shoot("i18n.add_translations", {
		locale: "en",
		values: { notifications_pending_notifications: "Pending notifications:" },
	})

	use(track_prey_jab)

	return () => notification_list()
}

const track_prey_jab: Maoka.Jab = ({ use, node }) => {
	const { hunter } = use(maoka_sdk.context.consume)

	const handle_onmount = () => {
		const handle_show = handle_show_with_id_creator(node.root.create_id)

		const release_hide = hunter.track("notifications.hide", handle_hide)
		const release_show = hunter.track("notifications.show", handle_show)

		return () => {
			release_hide()
			release_show()
		}
	}

	use(maoka_dom.jabs.onmount(handle_onmount))
}

const handle_hide: ClientSDK.GunFor<"notifications.hide"> = id =>
	notifications$.update("items", items => items.filter(item => item.id !== id))

const handle_show_with_id_creator: (create_id: Maoka.CreateId) => ClientSDK.GunFor<"notifications.show"> = create_id => item =>
	notifications$.update("items", items =>
		item.id
			? items.some(i => i.id === item.id)
				? items
				: items.concat(item)
			: items.concat({ ...item, id: create_id() as any, type: item.type }),
	)
