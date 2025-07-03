import { maoka, maoka_styled } from "@ordo-pink/maoka"
import { NOTIFICATION } from "@ordo-pink/sdk-client"
import { maoka_sdk } from "@ordo-pink/sdk-maoka"

import {
	user_card_body,
	user_card_footer,
	user_card_title,
	user_card_under_construction,
} from "../user-card/user-card.component"

import "./user-danger-zone.styles.css"

export const danger_zone_card = maoka.create("div", ({ use }) => {
	use(maoka_sdk.jabs.classes.set("danger-zone"))

	const { hunter } = use(maoka_sdk.context.consume)

	const t_title = use(maoka_sdk.jabs.translate$("user_workspace_current_danger_zone_title"))
	const t_hint = use(maoka_sdk.jabs.translate$("user_workspace_current_danger_zone_hint"))
	const t_remove_content = use(maoka_sdk.jabs.translate$("user_workspace_current_danger_zone_remove_content"))
	const t_remove_account = use(maoka_sdk.jabs.translate$("user_workspace_current_danger_zone_remove_account"))

	const handle_action_click = () =>
		void hunter.shoot("notifications.show", {
			message: "user_workspace_current_danger_zone_rrr_message",
			duration: 10,
			title: "user_workspace_current_danger_zone_rrr_title",
			type: NOTIFICATION.TYPE.RRR,
		})

	return () =>
		user_card_under_construction(() => [
			user_card_title(t_title),
			user_card_body(t_hint),
			user_card_footer(() =>
				actions(() => [
					maoka_sdk.components.button.danger({ kindergarten: t_remove_content, on_click: handle_action_click, disabled: true }),
					maoka_sdk.components.button.danger({ kindergarten: t_remove_account, on_click: handle_action_click, disabled: true }),
				]),
			),
		])
})

const actions = maoka_styled.div("actions")
