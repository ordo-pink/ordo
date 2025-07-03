import { maoka, maoka_styled } from "@ordo-pink/maoka"
import type { Session } from "@ordo-pink/sdk-core"
import { bs_x } from "@ordo-pink/frontend-icons"
import { maoka_sdk } from "@ordo-pink/sdk-maoka"

import { user_card, user_card_body, user_card_title } from "../user-card/user-card.component"

import "./user-session.styles.css"

const session_device_info = maoka_styled.div("device-info")
const session_status = maoka_styled.div("status")
const session_display = maoka.create<{ session: Session.Instance }>("div", ({ session, use }) => {
	use(maoka_sdk.jabs.classes.set("session"))
	use(maoka_sdk.jabs.set_attribute("title", session.get_created_at().toLocaleString()))

	const active = session.is_created_after(new Date(Date.now() - 600 * 1000))
	active ? use(maoka_sdk.jabs.classes.add("active")) : use(maoka_sdk.jabs.classes.remove("active"))

	const t_remove_session = use(maoka_sdk.jabs.translate$("user_workspace_current_sessions_remove"))

	return () => [
		session_status(),
		session_device_info(() => session.get_device_info()),
		bs_x({ on_click: () => void 0, title: t_remove_session() }),
	]
})

export const sessions_card = maoka.create<{ sessions: Session.Instance[] }>("div", ({ sessions, use }) => {
	const t_title = use(maoka_sdk.jabs.translate$("user_workspace_current_sessions_title"))

	return () =>
		user_card(() => [user_card_title(t_title), user_card_body(() => sessions.map(session => session_display({ session })))])
})
