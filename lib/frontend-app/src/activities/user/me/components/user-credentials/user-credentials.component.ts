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

import { maoka, maoka_styled } from "@ordo-pink/maoka"
import type { User } from "@ordo-pink/sdk-core"
import { maoka_sdk } from "@ordo-pink/sdk-maoka"

import { user_card, user_card_body, user_card_title } from "../user-card/user-card.component"

import "./user-credentials.styles.css"

export const credentials_card = maoka.create<{ handle: User.Handle; name: string; email: User.Email }>(
	"div",
	({ handle, email, name, use }) => {
		const state = use(maoka_sdk.context.consume)

		const t_edit = use(maoka_sdk.jabs.translate$("user_common_edit"))
		const t_email_title = use(maoka_sdk.jabs.translate$("user_workspace_current_user_info_email"))
		const t_handle_title = use(maoka_sdk.jabs.translate$("user_workspace_current_user_info_handle"))
		const t_name_title = use(maoka_sdk.jabs.translate$("user_workspace_current_user_info_name"))
		const t_modal_title = use(maoka_sdk.jabs.translate$("user_workspace_current_sessions_modal_notification_title"))
		const t_modal_message = use(maoka_sdk.jabs.translate$("user_workspace_current_sessions_modal_notification_message"))

		const [show_whoopsie_modal] = use(
			maoka_sdk.jabs.dialog.info(state, {
				render_body: div => void (div.innerHTML = t_modal_message()),
				title: t_modal_title,
			}),
		)

		use(maoka_sdk.jabs.classes.set("credentials-card"))

		return () =>
			user_card(() => [
				user_card_title(t_handle_title),
				user_card_body(() =>
					items(() => [
						item(() => [
							item_title(t_handle_title),
							item_content(() => handle),
							maoka_sdk.components.button.neutral({ hotkey: "meta+h", kindergarten: t_edit, on_click: show_whoopsie_modal }),
						]),
						item(() => [
							item_title(t_email_title),
							item_content(() => email),
							maoka_sdk.components.button.neutral({ hotkey: "meta+e", kindergarten: t_edit, on_click: show_whoopsie_modal }),
						]),
						item(() => [
							item_title(t_name_title),
							item_content(() => name),
							maoka_sdk.components.button.neutral({ hotkey: "meta+n", kindergarten: t_edit, on_click: show_whoopsie_modal }),
						]),
					]),
				),
			])
	},
)

const items = maoka_styled.div("items")
const item = maoka_styled.div("item")
const item_title = maoka_styled.div("title")
const item_content = maoka_styled.div("content")
