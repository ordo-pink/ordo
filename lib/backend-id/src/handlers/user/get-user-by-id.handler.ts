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
import { PublicUser } from "@ordo-pink/core"
import { type TIntake } from "@ordo-pink/routary"

import { type TSharedContext } from "../../backend-id.types"
import { default_handler } from "../default.handler"
import { invalid_id_rrr } from "../../rrrs/invalid-user-id.rrr"

export const handle_get_user_by_id = default_handler(intake =>
	Oath.Resolve(intake.params.user_id)
		.pipe(ops0.chain(validate_user_id(intake)))
		.pipe(ops0.chain(get_by_id(intake)))
		.pipe(ops0.map(serialize_to_public_user))
		.pipe(ops0.map(user => void (intake.payload = user)))
		.pipe(ops0.map(() => intake)),
)

// --- Internal ---

type I = TIntake<TSharedContext>

const serialize_to_public_user = PublicUser.Serialize

const validate_user_id = (intake: I) => (id: unknown) =>
	Oath.If(PublicUser.Validations.is_id(id), { T: () => id as Ordo.User.ID, F: () => invalid_id_rrr(id, intake) })

const get_by_id = (intake: I) => (id: Ordo.User.ID) =>
	intake.user_persistence_strategy.get_by_id(id).pipe(ops0.rejected_map(rrr => ({ rrr, intake })))
