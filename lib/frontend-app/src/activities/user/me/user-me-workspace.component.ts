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
import type { ClientSDK } from "@ordo-pink/sdk-client"
import { maoka_sdk } from "@ordo-pink/sdk-maoka"

import { user_card_body, user_card_title, user_card_under_construction } from "./components/user-card/user-card.component"
import { credentials_card } from "./components/user-credentials/user-credentials.component"
import { danger_zone_card } from "./components/user-danger-zone/user-danger-zone.component"
import { sessions_card } from "./components/user-session/user-session.component"

import "./user-me-workspace.styles.css"

export const current_user_workspace = maoka.create<{ state: ClientSDK.F.State }>("div", ({ state, use }) => {
	use(maoka_sdk.context.provide(state))
	use(maoka_sdk.jabs.classes.set("current-user-workspace"))

	const { auth$, hunter } = use(maoka_sdk.context.consume)
	const get_user = use(maoka_sdk.jabs.zags.cheat$(auth$, "user"))

	hunter.shoot("title.set_title", "user_workspace_current_activity_name")

	return () => {
		const user = get_user()

		return (
			user &&
			cards(() => [
				credentials_card({ email: user.get_email(), handle: user.get_handle(), name: user.get_name() }),
				sessions_card({ sessions: user.get_sessions() }),
				achievements_card(),
				settings_card(),
				danger_zone_card(),
				two_factor_auth_card(),
			])
		)
	}
})

const cards = maoka_styled.div("cards")

const two_factor_auth_card = maoka.create("div", ({ use }) => {
	const t_title = use(maoka_sdk.jabs.translate$("user_workspace_current_two_factor_auth_title"))
	const t_message = use(maoka_sdk.jabs.translate$("user_workspace_current_two_factor_auth_message"))

	return () => user_card_under_construction(() => [user_card_title(t_title), user_card_body(t_message)])
})

const achievements_card = maoka.create("div", ({ use }) => {
	const t_title = use(maoka_sdk.jabs.translate$("user_workspace_current_achievements_title"))
	const t_message = use(maoka_sdk.jabs.translate$("user_workspace_current_achievements_message"))

	return () => user_card_under_construction(() => [user_card_title(t_title), user_card_body(t_message)])
})

const settings_card = maoka.create("div", ({ use }) => {
	const t_title = use(maoka_sdk.jabs.translate$("user_workspace_current_settings_title"))
	const t_message = use(maoka_sdk.jabs.translate$("user_workspace_current_settings_message"))

	return () => user_card_under_construction(() => [user_card_title(t_title), user_card_body(t_message)])
})
