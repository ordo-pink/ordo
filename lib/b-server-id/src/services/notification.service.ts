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

import type { Notification } from "../b-server-id.types"

export const create: Notification.CreateService = email_strategy => ({
	code_requested: ordo.fns.curry(
		(email, code) => void email_strategy.send(`code_requested_${email}_${code}`, "Code Requested", code, { email: email }),
	),
	email_change_requested: ordo.fns.curry((old_email, new_email, code) => {
		void email_strategy.send(`email_change_requested_${new_email}`, "Confirm Email Change", code, { email: new_email })
		void email_strategy.send(`email_change_requested_${old_email}`, "Email Change Requested", "Yep", { email: new_email })
	}),
	email_changed: old_email =>
		void email_strategy.send(`email_changed_${old_email}`, "Email Changed", "Yep", { email: old_email }),
	signed_in: ordo.fns.curry(
		(email, ip, info) =>
			void email_strategy.send(`signed_in_${email}_${ip}`, "Someone Logged In", `${info} - ${ip}`, { email: email }),
	),
	signed_up: email => void email_strategy.send(`signed_up_${email}`, "Welcome to ORDO!", "Hey!", { email: email }),
	kill: () => void email_strategy.kill(),
})
