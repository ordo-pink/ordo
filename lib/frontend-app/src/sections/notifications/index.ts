import { type ClientSDK, NOTIFICATION } from "@ordo-pink/sdk-client"
import { type Maoka, maoka_dom } from "@ordo-pink/maoka"
import { maoka_sdk } from "@ordo-pink/sdk-maoka"
import { rrr } from "@ordo-pink/sdk-core"

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
		const handle_rrr = handle_rrr_with_id_creator(node.root.create_id)

		const release_hide = hunter.track("notifications.hide", handle_hide)
		const release_rrr = hunter.track("notifications.rrr", handle_rrr)
		const release_show = hunter.track("notifications.show", handle_show)

		return () => {
			release_hide()
			release_rrr()
			release_show()
		}
	}

	use(maoka_dom.jabs.onmount(handle_onmount))
}

const handle_hide: ClientSDK.GunFor<"notifications.hide"> = id =>
	notifications$.update("items", items => items.filter(item => item.id !== id))

const handle_rrr_with_id_creator: (create_id: Maoka.CreateId) => ClientSDK.GunFor<"notifications.rrr"> =
	create_id =>
	({ type, message, debug }) => {
		console.debug(debug)

		notifications$.update("items", items =>
			items.concat([
				{
					id: create_id() as any,
					message,
					title: `rrr_codes_${rrr.to_readable_type(type)}`,
					duration: 30,
					type: NOTIFICATION.TYPE.RRR,
				},
			]),
		)
	}

const handle_show_with_id_creator: (create_id: Maoka.CreateId) => ClientSDK.GunFor<"notifications.show"> = create_id => item =>
	notifications$.update("items", items =>
		item.id
			? items.some(i => i.id === item.id)
				? items
				: items.concat(item as ClientSDK.Notification.Instance)
			: items.concat({ ...item, id: create_id() as any, type: item.type }),
	)
