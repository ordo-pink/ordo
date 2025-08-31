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

import * as maoka from "@ordo-pink/oss-maoka"
import { type Core, core } from "@ordo-pink/sdk-core"
import { bs_x } from "@ordo-pink/frontend-icons"
import { client_maoka } from "@ordo-pink/sdk-client-maoka"
import maoka_styled from "@ordo-pink/oss-maoka/styled"

import { user_card, user_card_body, user_card_title } from "../user-card/user-card.component"

import "./user-session.styles.css"

const session_device_info = maoka_styled.div("device-info")
const session_status = maoka_styled.div("status")
const session_display = maoka.create<{ session: Core.Session.Instance }>("div", ({ session, use }) => {
	const state = use(client_maoka.context.consume)

	use(client_maoka.jabs.classes.set("session"))
	use(client_maoka.jabs.set_attribute("title", session[1]))

	const active = core.session.was_active_in(600 * 1000, session)
	active ? use(client_maoka.jabs.classes.add("active")) : use(client_maoka.jabs.classes.remove("active"))

	const t_remove_session = use(client_maoka.jabs.translate$("user_workspace_current_sessions_remove"))
	const t_modal_title = use(client_maoka.jabs.translate$("user_workspace_current_sessions_modal_notification_title"))
	const t_modal_message = use(client_maoka.jabs.translate$("user_workspace_current_sessions_modal_notification_message"))

	const [show_whoopsie_modal] = use(
		client_maoka.jabs.dialog.info(state, {
			render_body: div => void (div.innerHTML = t_modal_message()),
			title: t_modal_title,
		}),
	)

	return () => [
		session_status(),
		session_device_info(() => session[1]),
		bs_x({ on_click: show_whoopsie_modal, title: t_remove_session() }),
	]
})

export const sessions_card = maoka.create<{ sessions: Core.Session.Instance[] }>("div", ({ sessions, use }) => {
	const t_title = use(client_maoka.jabs.translate$("user_workspace_current_sessions_title"))

	return () =>
		user_card(() => [user_card_title(t_title), user_card_body(() => sessions?.map(session => session_display({ session })))])
})
