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

import { type User, user } from "@ordo-pink/sdk-core"
import { default_handler } from "@ordo-pink/sdk-server-routary"
import { oath } from "@ordo-pink/oss-oath"

import type { ServerID } from "../../backend-server-id.types"
import { invalid_handle_rrr } from "../../rrrs/invalid-user-handle.rrr"

export const handle_get_user_by_handle = default_handler<ServerID.Fuel>(intake =>
	oath
		.of(intake.params.user_handle)
		.pipe(oath.ops.chain(validate_user_handle(intake)))
		.pipe(oath.ops.chain(get_user_by_handle(intake)))
		.pipe(oath.ops.map(u => u.to_dto()))
		.pipe(oath.ops.map(dto => user.someone.from_dto(...dto).to_dto()))
		.pipe(oath.ops.map(user => void (intake.payload = user)))
		.pipe(oath.ops.map(() => intake)),
)

// --- Internal ---

const is_handle = user.someone.validations.is_handle

const validate_user_handle = (intake: ServerID.Intake) => (handle?: string) =>
	oath.if(is_handle(handle), { on_false: () => invalid_handle_rrr(handle!, intake), on_true: () => handle as User.Handle })

const get_user_by_handle = (intake: ServerID.Intake) => (handle: User.Handle) =>
	intake.reference_mapping_user
		.get_by_handle(handle)
		.pipe(oath.ops.chain(id => intake.persistence_strategy_user.read(id)))
		.pipe(oath.ops.rmap(rrr => ({ rrr, intake })))
