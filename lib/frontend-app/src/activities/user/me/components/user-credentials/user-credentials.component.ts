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

import type { Core } from "@ordo-pink/sdk-core"
import { client_maoka } from "@ordo-pink/sdk-client-maoka"
import { maoka } from "@ordo-pink/oss-maoka"

import { user_card, user_card_body, user_card_title } from "../user-card/user-card.component"

import "./user-credentials.styles.css"

export const credentials_card = maoka.create<{ ref: Core.User.Ref; name: string; email: Core.User.Email }>(
	"div",
	({ ref, email, name, use }) => {
		const state = use(client_maoka.context.consume)

		const t_edit = use(client_maoka.jabs.translate$("user_common_edit"))
		const t_email_title = use(client_maoka.jabs.translate$("user_workspace_current_user_info_email"))
		const t_handle_title = use(client_maoka.jabs.translate$("user_workspace_current_user_info_handle"))
		const t_name_title = use(client_maoka.jabs.translate$("user_workspace_current_user_info_name"))
		const t_modal_title = use(client_maoka.jabs.translate$("user_workspace_current_sessions_modal_notification_title"))
		const t_modal_message = use(client_maoka.jabs.translate$("user_workspace_current_sessions_modal_notification_message"))

		const [show_whoopsie_modal] = use(
			client_maoka.jabs.dialog.info(state, {
				render_body: div => void (div.innerHTML = t_modal_message()),
				title: t_modal_title,
			}),
		)

		use(client_maoka.jabs.classes.set("credentials-card"))

		return () =>
			user_card(() => [
				user_card_title(t_handle_title),
				user_card_body(() =>
					items(() => [
						item(() => [
							item_title(t_handle_title),
							item_content(() => ref),
							client_maoka.components.button.neutral({ hotkey: "meta+h", kindergarten: t_edit, on_click: show_whoopsie_modal }),
						]),
						item(() => [
							item_title(t_email_title),
							item_content(() => email),
							client_maoka.components.button.neutral({ hotkey: "meta+e", kindergarten: t_edit, on_click: show_whoopsie_modal }),
						]),
						item(() => [
							item_title(t_name_title),
							item_content(() => name),
							client_maoka.components.button.neutral({ hotkey: "meta+n", kindergarten: t_edit, on_click: show_whoopsie_modal }),
						]),
					]),
				),
			])
	},
)

const items = maoka.styled.div("items")
const item = maoka.styled.div("item")
const item_title = maoka.styled.div("title")
const item_content = maoka.styled.div("content")
