/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2024  谢尔盖 ||↓ and the Ordo.pink contributors
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

import { type ClientSDK, NOTIFICATION } from "@ordo-pink/sdk-client"
import {
	bs_check_circle,
	bs_circle,
	bs_error_circle,
	bs_exclamation_circle,
	bs_info_circle,
	bs_question_circle,
} from "@ordo-pink/frontend-icons"
import { maoka, maoka_dom } from "@ordo-pink/oss-maoka"
import { sweech } from "@ordo-pink/oss-sweech"

export const notification_icon = maoka.create<Pick<ClientSDK.Notification.Instance, "render_icon" | "type">>(
	"div",
	({ render_icon, type, use }) => {
		if (render_icon) use(maoka_dom.jabs.hit_if_dom(n => void render_icon(n.value as HTMLDivElement)))
		else return () => render_default_icon(type)
	},
)

// --- Internal ---

const render_default_icon = (type?: NOTIFICATION.TYPE) =>
	sweech
		.match(type)
		.case(NOTIFICATION.TYPE.INFO, () => bs_info_circle({ classes: "text-sky-500" }))
		.case(NOTIFICATION.TYPE.QUESTION, () => bs_question_circle({ classes: "text-violet-500" }))
		.case(NOTIFICATION.TYPE.RRR, () => bs_error_circle({ classes: "text-rose-500" }))
		.case(NOTIFICATION.TYPE.SUCCESS, () => bs_check_circle({ classes: "text-emerald-500" }))
		.case(NOTIFICATION.TYPE.WARN, () => bs_exclamation_circle({ classes: "text-amber-500" }))
		.default(() => bs_circle({ classes: "text-neutral-500" }))
