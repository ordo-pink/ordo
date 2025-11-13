import * as icons from "@ordo-pink/frontend-icons"
import { maoka } from "@ordo-pink/oss-maoka"
import { maoka_dom } from "@ordo-pink/oss-maoka/dom"
import { maoka_styled } from "@ordo-pink/oss-maoka-styled"
import { sweech } from "@ordo-pink/oss-sweech"
import { zags } from "@ordo-pink/oss-zags"

import "./notifications.styles.css"

export const notifications = maoka.create("div", ({ use }) => {
	const { hunter } = use(ordo_client_maoka.context.consume)
	const translate = use(ordo_client_maoka.jabs.translate$)
	const get_list = use(ordo_client_maoka.jabs.cheat$(notifications$, "items" as const))

	use(ordo_client_maoka.jabs.set_class("notification-list"))
	use(maoka_dom.jabs.onmount(() => handle_onmount()))

	const handle_onmount = () => {
		hunter.shoot("i18n.add_translations", {
			locale: "en",
			values: { notifications_pending_notifications: "Pending notifications:" },
		})

		const release_hide = hunter.track("notification.hide", id =>
			notifications$.update("items", items => items.filter(item => item.id !== id)),
		)

		const release_rrr = hunter.track("notification.rrr", ({ type, message }) => {
			notifications$.update("items", items =>
				items.concat([
					{
						id: crypto.randomUUID(),
						message,
						title: `rrr_codes_${ordo.rrr.to_readable(type)}`,
						duration_s: 30,
						type: ORDO_CLIENT.NOTIFICATION.TYPE.RRR,
					},
				]),
			)
		})

		const release_show = hunter.track("notification.show", item => {
			notifications$.update("items", items => {
				items = item.id
					? items.some(i => i.id === item.id)
						? items
						: items.concat(item as OrdoClient.Notification.Instance)
					: items.concat({ ...item, id: crypto.randomUUID(), type: item.type })

				return items
			})
		})

		return () => {
			release_hide()
			release_rrr()
			release_show()
		}
	}

	return () => {
		const notifications = get_list()
		const has_pending_notifications = notifications.length > 5

		return [
			...get_list()
				.slice(0, 5)
				.map(item => notification(item)),

			has_pending_notifications
				? hidden_notifications_block(() =>
						hidden_notifications_list(() => [translate("notifications_pending_notifications"), " ", notifications.length - 5]),
					)
				: void 0,
		]
	}
})

// --- Internal ---

export const notifications$ = zags.create<{
	items: OrdoClient.Notification.Instance[]
	progress_bars: Record<string, number>
}>({ items: [], progress_bars: {} })

const hidden_notifications_block = maoka_styled.div("more-notifications_card")
const hidden_notifications_list = maoka_styled.div("more-notifications_body")

const notification = maoka.create<OrdoClient.Notification.Instance>(
	"div",
	({ on_click, id, message, duration_s: duration, render_icon, title, type, use }) => {
		const translate = use(ordo_client_maoka.jabs.translate$)

		use(ordo_client_maoka.jabs.set_class("notification-card_container"))

		if (on_click) {
			use(ordo_client_maoka.jabs.add_class("interactive"))
			use(ordo_client_maoka.jabs.listen("onclick", on_click))
		} else {
			use(ordo_client_maoka.jabs.remove_class("interactive"))
			use(ordo_client_maoka.jabs.listen("onclick", () => void 0))
		}

		const card_type = get_readable_type(type)
		const notification_card = create_notification_card(card_type)

		return () =>
			notification_card(() => [
				notification_icon({ render_icon, type }),
				notification_body(() => [
					title ? notification_title(() => translate(title)) : void 0,
					notification_message(() => translate(message)),
				]),
				duration ? notification_progress({ id, duration_s: duration, type }) : void 0,
				hide_notification_button({ id, type }),
			])
	},
)

// --- Internal ---

const create_notification_card = (card_type: string) => maoka_styled.div(`notification-card ${card_type}`)
const notification_body = maoka_styled.div("notification-card_body")
const notification_message = maoka_styled.p()
const notification_title = maoka_styled.h2("notification-card_title")

const notification_progress = maoka.create<
	Pick<OrdoClient.Notification.Instance, "id" | "type"> & Required<Pick<OrdoClient.Notification.Instance, "duration">>
>("div", ({ id, type, duration_s: duration, use }) => {
	const get_progress = use(ordo_client_maoka.jabs.cheat$(notifications$, `progress_bars.${id}` as const))

	const { hunter } = use(ordo_client_maoka.context.consume)

	const handle_onmount = () => {
		const update_progress_bar = () => {
			notifications$.update("progress_bars", progress_bars => ({
				...progress_bars,
				[id]: progress_bars[id] === 0 ? 0 : !progress_bars[id] ? 100 : progress_bars[id] > 0 ? progress_bars[id] - 1 : 0,
			}))
		}

		update_progress_bar()
		const interval = setInterval(update_progress_bar, duration * 10)

		return () => clearInterval(interval)
	}

	use(ordo_client_maoka.jabs.set_class("notification-card_progress"))
	use(maoka_dom.jabs.onmount(handle_onmount))

	return () => {
		const progress = get_progress()
		const notifications = notifications$.select("items")

		if (progress === 0 && notifications.some(notification => notification.id === id)) {
			hunter.shoot("notification.hide", id)
			return
		}

		return progress_bar_foreground({ progress, type })
	}
})

// --- Internal ---

const progress_bar_foreground = maoka.create<Pick<OrdoClient.Notification.Instance, "type"> & { progress: number }>(
	"div",
	({ progress, type, use }) => {
		if (!progress) return

		use(ordo_client_maoka.jabs.set_class("notification-card_progress_foreground", get_readable_type(type)))
		use(ordo_client_maoka.jabs.set_style({ width: progress.toFixed(0).concat("%") }))
	},
)

const notification_icon = maoka.create<Pick<OrdoClient.Notification.Instance, "render_icon" | "type">>(
	"div",
	({ render_icon, type, use }) => {
		if (render_icon) use(maoka_dom.jabs.if_dom(n => void render_icon(n.value as HTMLDivElement)))
		else
			return () =>
				sweech
					.match(type)
					.case(ORDO_CLIENT.NOTIFICATION.TYPE.INFO, () => icons.bs_info_circle({ classes: "text-sky-500" }))
					.case(ORDO_CLIENT.NOTIFICATION.TYPE.QUESTION, () => icons.bs_question_circle({ classes: "text-violet-500" }))
					.case(ORDO_CLIENT.NOTIFICATION.TYPE.RRR, () => icons.bs_error_circle({ classes: "text-rose-500" }))
					.case(ORDO_CLIENT.NOTIFICATION.TYPE.SUCCESS, () => icons.bs_check_circle({ classes: "text-emerald-500" }))
					.case(ORDO_CLIENT.NOTIFICATION.TYPE.WARN, () => icons.bs_exclamation_circle({ classes: "text-amber-500" }))
					.default(() => icons.bs_circle({ classes: "text-neutral-500" }))
	},
)

const hide_notification_button = maoka.create<Pick<OrdoClient.Notification.Instance, "id" | "type">>(
	"button",
	({ id, type, use }) => {
		const { hunter } = use(ordo_client_maoka.context.consume)
		const readable_type = get_readable_type(type)

		const handle_click = (event: MouseEvent) => {
			event.preventDefault()
			event.stopPropagation()

			hunter.shoot("notification.hide", id)
		}

		use(ordo_client_maoka.jabs.set_attribute("aria-label", "Close"))
		use(ordo_client_maoka.jabs.set_class("notification-card_close", readable_type))
		use(ordo_client_maoka.jabs.listen("onclick", handle_click))

		return () => icons.bs_x()
	},
)

export const get_readable_type = (type = ORDO_CLIENT.NOTIFICATION.TYPE.DEFAULT) =>
	sweech
		.match(type)
		.case(ORDO_CLIENT.NOTIFICATION.TYPE.INFO, () => "info")
		.case(ORDO_CLIENT.NOTIFICATION.TYPE.QUESTION, () => "question")
		.case(ORDO_CLIENT.NOTIFICATION.TYPE.RRR, () => "rrr")
		.case(ORDO_CLIENT.NOTIFICATION.TYPE.SUCCESS, () => "success")
		.case(ORDO_CLIENT.NOTIFICATION.TYPE.WARN, () => "warn")
		.default(() => "default")
