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
import { type Intake } from "@ordo-pink/routary"
import { default_handler } from "@ordo-pink/backend-util-default-handler"

import { type TIDContext } from "../../backend-id.types"
import { invalid_handle_rrr } from "../../rrrs/invalid-user-handle.rrr"

export const handle_get_user_by_handle = default_handler<TIDContext>(intake =>
	Oath.Resolve(intake.params.user_handle)
		.pipe(ops0.chain(validate_user_handle(intake)))
		.pipe(ops0.chain(get_user_by_handle(intake)))
		.pipe(ops0.map(u => u.to_dto()))
		.pipe(ops0.map(serialize_to_public_user))
		.pipe(ops0.map(user => void (intake.payload = user)))
		.pipe(ops0.map(() => intake)),
)

// --- Internal ---

type I = Intake<TIDContext>

const is_handle = PublicUser.Validations.is_handle

const serialize_to_public_user = PublicUser.Serialize

const validate_user_handle = (intake: I) => (handle?: string) =>
	Oath.If(is_handle(handle), { F: () => invalid_handle_rrr(handle!, intake), T: () => handle as Ordo.User.Handle })

const get_user_by_handle = (intake: I) => (handle: Ordo.User.Handle) =>
	intake.user_persistence_strategy.get_by_handle(handle).pipe(ops0.rejected_map(rrr => ({ rrr, intake })))
