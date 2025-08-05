/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2025  谢尔盖 ||↓ and the Ordo.pink contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { maoka, maoka_styled } from "@ordo-pink/oss-maoka"
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
