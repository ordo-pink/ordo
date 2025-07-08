import { type Session, type User, core_sdk } from "@ordo-pink/sdk-core"
import { maoka, maoka_styled } from "@ordo-pink/maoka"
import type { ClientSDK } from "@ordo-pink/sdk-client"
import { maoka_sdk } from "@ordo-pink/sdk-maoka"

import "./current-user-workspace.styles.css"
import { bs_x } from "@ordo-pink/frontend-icons"

export const current_user_workspace = maoka.create<{ state: ClientSDK.F.State }>("div", ({ state, use }) => {
	use(maoka_sdk.context.provide(state))
	use(maoka_sdk.jabs.classes.set("current-user-workspace"))

	const { auth$ } = use(maoka_sdk.context.consume)
	const get_user = use(maoka_sdk.jabs.zags.cheat$(auth$, "user"))

	return () => {
		const user = get_user()

		return (
			user &&
			cards(() => [
				handle_card({ handle: user.get_handle() }),
				email_card({ email: user.get_email() }),
				public_name_card({ name: user.get_name() }),
				sessions_card({ sessions: user.get_sessions() }),
			])
		)
	}
})

const cards = maoka_styled.div("cards")
const card = maoka_styled.div("user-card")
const card_body = maoka_styled.div("body")
const card_title = maoka_styled.h2("title")
const card_footer = maoka_styled.div("footer")

const handle_card = maoka.create<{ handle: User.Handle }>("div", ({ handle, use }) => {
	const t_title = use(maoka_sdk.jabs.translate$("user_workspace_current_handle_title"))
	const t_edit = use(maoka_sdk.jabs.translate$("user_common_edit"))

	return () =>
		card(() => [
			card_title(t_title),
			card_body(() => handle),
			card_footer(() =>
				maoka_sdk.components.button.neutral({
					hotkey: "meta+h",
					kindergarten: t_edit,
					on_click: () => void 0,
				}),
			),
		])
})

const email_card = maoka.create<{ email: User.Email }>("div", ({ email, use }) => {
	const t_title = use(maoka_sdk.jabs.translate$("user_workspace_current_email_title"))
	const t_edit = use(maoka_sdk.jabs.translate$("user_common_edit"))

	return () =>
		card(() => [
			card_title(t_title),
			card_body(() => core_sdk.fns.obfuscate_email(email)),
			card_footer(() =>
				maoka_sdk.components.button.neutral({
					hotkey: "meta+e",
					kindergarten: t_edit,
					on_click: () => void 0,
				}),
			),
		])
})

const public_name_card = maoka.create<{ name: string }>("div", ({ name, use }) => {
	const t_title = use(maoka_sdk.jabs.translate$("user_workspace_current_name_title"))
	const t_edit = use(maoka_sdk.jabs.translate$("user_common_edit"))

	return () =>
		card(() => [
			card_title(t_title),
			card_body(() => name || "Noname"),
			card_footer(() =>
				maoka_sdk.components.button.neutral({
					hotkey: "meta+n",
					kindergarten: t_edit,
					on_click: () => void 0,
				}),
			),
		])
})

const session_device_info = maoka_styled.div("device-info")
const session_status = maoka_styled.div<{ active: boolean }>("status", ({ active, use }) =>
	active ? use(maoka_sdk.jabs.classes.add("active")) : use(maoka_sdk.jabs.classes.remove("active")),
)
const session_display = maoka.create<{ session: Session.Instance }>("div", ({ session, use }) => {
	use(maoka_sdk.jabs.classes.set("session"))
	use(maoka_sdk.jabs.set_attribute("title", session.get_created_at().toLocaleString()))

	const t_remove_session = use(maoka_sdk.jabs.translate$("user_workspace_current_sessions_remove"))
	const active = session.is_created_after(new Date(Date.now() - 600 * 1000))

	return () => [
		session_status({ active }),
		session_device_info(() => session.get_device_info()),
		bs_x({ on_click: () => void 0, title: t_remove_session() }),
	]
})

const sessions_card = maoka.create<{ sessions: Session.Instance[] }>("div", ({ sessions, use }) => {
	const t_title = use(maoka_sdk.jabs.translate$("user_workspace_current_sessions_title"))

	return () => card(() => [card_title(t_title), card_body(() => sessions.map(session => session_display({ session })))])
})
