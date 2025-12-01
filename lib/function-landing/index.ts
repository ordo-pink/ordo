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

import { LOCALE } from "@ordo-pink/oss-i18n"
import { bs_house } from "@ordo-pink/frontend-icons"
import { client_maoka } from "@ordo-pink/sdk-client-maoka"
import { client_sdk } from "@ordo-pink/sdk-client"
import { create } from "@ordo-pink/oss-maoka"

import { workspace } from "./src/components/workspace.component"

export default client_sdk.create_f(
	"@ordo.pink/landing",
	{
		commands: [
			"activity.register",
			"user.show_request_code_modal",
			"i18n.add",
			"i18n.delete",
			"notifications.show",
			"sidebar.hide",
			"title.set_title",
		],
		queries: ["i18n$"], // TODO throw error if query is missing
	},
	state => {
		const create_id = () => crypto.randomUUID()
		const icon = bs_house()
		const workspace_with_state = client_maoka.components.with_state(state, workspace)

		state.hunter.shoot("i18n.add", {
			locale: LOCALE.ENGLISH,
			values: {
				fns_landing_buttons_join: "Join",
				fns_landing_buttons_learn_more: "Learn More",
				fns_landing_buttons_try_now: "Try Now",
				fns_landing_cookie_notification_message: "Wait, what?",
				fns_landing_cookie_notification_title: "We don't use cookies",
				fns_landing_cta_announcement: "v11 is out!",
				fns_landing_title: "Welcome to ORDO!",
			},
		})

		state.hunter.shoot("activity.register", {
			id: "@ordo.pink/landing",
			readable_name: "fns_landing_title",
			render_icon: span => create.dom.render(span, icon, create_id),
			render_workspace: div => create.dom.render(div, workspace_with_state, create_id),
			routes: ["/"],
			start_route: "/",
		})

		return () => {
			state.hunter.shoot("activity.unregister", "@ordo.pink/landing") // TODO Drop current activity if it was unregistered
			state.hunter.shoot("i18n.delete", [
				"fns_landing_buttons_join",
				"fns_landing_buttons_learn_more",
				"fns_landing_buttons_try_now",
				"fns_landing_cookie_notification_message",
				"fns_landing_cookie_notification_title",
				"fns_landing_cta_announcement",
				"fns_landing_title",
			])
		}
	},
)
