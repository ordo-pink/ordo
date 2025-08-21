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

import type { ClientSDK } from "@ordo-pink/sdk-client"
import { client_maoka } from "@ordo-pink/sdk-client-maoka"
import { core } from "@ordo-pink/sdk-core"
import { maoka } from "@ordo-pink/oss-maoka"
import { maoka_styled } from "@ordo-pink/oss-maoka/styled"
import { result } from "@ordo-pink/oss-result"

import { user_card_body, user_card_title, user_card_under_construction } from "./components/user-card/user-card.component"
import { credentials_card } from "./components/user-credentials/user-credentials.component"
import { danger_zone_card } from "./components/user-danger-zone/user-danger-zone.component"
import { sessions_card } from "./components/user-session/user-session.component"

import "./user-me-workspace.styles.css"

export const current_user_workspace = maoka.create<{ state: ClientSDK.F.State }>("div", ({ state, use }) => {
	use(client_maoka.context.provide(state))
	use(client_maoka.jabs.classes.set("current-user-workspace"))

	const { auth$, hunter } = use(client_maoka.context.consume)
	const get_user = use(client_maoka.jabs.zags.cheat$(auth$, "user"))

	hunter.shoot("title.set_title", "user_workspace_current_activity_name")

	return () =>
		result
			.from_nullable(get_user())
			.pipe(
				result.ops.map(u => ({
					email: core.user.get_email(u),
					ref: core.user.get_ref(u),
					name: core.user.get_name(u),
					sessions: core.user.get_sessions(u),
				})),
			)
			.pipe(
				result.ops.map(({ email, ref, name, sessions }) =>
					cards(() => [
						credentials_card({ email, ref, name }),
						sessions_card({ sessions }),
						achievements_card(),
						settings_card(),
						danger_zone_card(),
						two_factor_auth_card(),
					]),
				),
			)
			.cata(result.catas.or_nothing())
})

const cards = maoka_styled.div("cards")

const two_factor_auth_card = maoka.create("div", ({ use }) => {
	const t_title = use(client_maoka.jabs.translate$("user_workspace_current_two_factor_auth_title"))
	const t_message = use(client_maoka.jabs.translate$("user_workspace_current_two_factor_auth_message"))

	return () => user_card_under_construction(() => [user_card_title(t_title), user_card_body(t_message)])
})

const achievements_card = maoka.create("div", ({ use }) => {
	const t_title = use(client_maoka.jabs.translate$("user_workspace_current_achievements_title"))
	const t_message = use(client_maoka.jabs.translate$("user_workspace_current_achievements_message"))

	return () => user_card_under_construction(() => [user_card_title(t_title), user_card_body(t_message)])
})

const settings_card = maoka.create("div", ({ use }) => {
	const t_title = use(client_maoka.jabs.translate$("user_workspace_current_settings_title"))
	const t_message = use(client_maoka.jabs.translate$("user_workspace_current_settings_message"))

	return () => user_card_under_construction(() => [user_card_title(t_title), user_card_body(t_message)])
})
