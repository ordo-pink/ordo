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

import { Oath, ops0 } from "@ordo-pink/oath"
import { type Intake } from "@ordo-pink/routary"
import { json_body_rrr } from "@ordo-pink/backend-util-body"

import { type TIDContext } from "../backend-id.types"

export const create_session_id = (intake: Intake<TIDContext>) => (user: Ordo.User.Current.Instance) =>
	Oath.Try(() => [crypto.randomUUID(), Date.now(), intake.req.headers.get("User-Agent") ?? undefined] as Ordo.User.Session)
		.pipe(ops0.map(sid => ({ sid, user })))
		.pipe(ops0.rejected_map(rrr => json_body_rrr(rrr, intake)))
