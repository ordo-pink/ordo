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

import { public_user } from "@ordo-pink/core"
import { type Routary } from "@ordo-pink/routary"
import { default_handler } from "@ordo-pink/routary-ordo"
import { oath } from "@ordo-pink/oath"

import { type TIDContext } from "../../backend-server-id.types"
import { invalid_id_rrr } from "../../rrrs/invalid-user-id.rrr"

export const handle_get_user_by_id = default_handler<TIDContext>(intake =>
	oath
		.of(intake.params.user_id)
		.pipe(oath.ops.chain(validate_user_id(intake)))
		.pipe(oath.ops.chain(get_by_id(intake)))
		.pipe(oath.ops.map(u => u.to_dto()))
		.pipe(oath.ops.map(serialize_to_public_user))
		.pipe(oath.ops.map(user => void (intake.payload = user)))
		.pipe(oath.ops.map(() => intake)),
)

// --- Internal ---

type I = Routary.Intake<TIDContext>

const serialize_to_public_user = public_user.serialize

const validate_user_id = (intake: I) => (id: unknown) =>
	oath.if(public_user.validations.is_uid(id), {
		on_true: () => id as Ordo.User.UID,
		on_false: () => invalid_id_rrr(id, intake),
	})

const get_by_id = (intake: I) => (id: Ordo.User.UID) =>
	intake.persistence_strategy_user.read(id).pipe(oath.ops.rmap(rrr => ({ rrr, intake })))
