import { type ClientSDK, NOTIFICATION } from "@ordo-pink/sdk-client"
import { maoka, maoka_styled } from "@ordo-pink/maoka"
import { maoka_sdk } from "@ordo-pink/sdk-maoka"

export const close_session_modal = maoka.create<{ state: ClientSDK.F.State }>("div", ({ state, use }) => {
	use(maoka_sdk.context.provide(state))
	use(maoka_sdk.jabs.classes.set("close-session-modal"))

	const { hunter } = use(maoka_sdk.context.consume)

	const t_title = use(maoka_sdk.jabs.translate$("user_workspace_current_sessions_modal_title"))
	const t_hint = use(maoka_sdk.jabs.translate$("user_workspace_current_sessions_modal_hint"))
	const t_ok = use(maoka_sdk.jabs.translate$("user_common_ok"))
	const t_cancel = use(maoka_sdk.jabs.translate$("user_common_cancel"))

	return () => [
		title(t_title),
		body(t_hint),
		actions(() => [
			maoka_sdk.components.button.neutral({
				kindergarten: t_cancel,
				on_click: () => void hunter.shoot("modal.hide"),
				hotkey: { hotkey: "Esc" },
			}),
			maoka_sdk.components.button.primary({
				kindergarten: t_ok,
				on_click: () => {
					hunter.shoot("notifications.show", {
						title: "user_workspace_current_sessions_modal_notification_title",
						message: "user_workspace_current_sessions_modal_notification_message",
						duration: 10,
						type: NOTIFICATION.TYPE.RRR,
					})

					hunter.shoot("modal.hide")
				},
				hotkey: "Enter",
			}),
		]),
	]
})

const title = maoka_styled.h2("title")
const body = maoka_styled.p("body")
const actions = maoka_styled.div("actions")
