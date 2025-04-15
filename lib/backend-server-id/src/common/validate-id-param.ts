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

import { CurrentUser } from "@ordo-pink/core"
import { type Routary } from "@ordo-pink/routary"
import { oath } from "@ordo-pink/oath"

import { type TIDContext } from "../backend-server-id.types"
import { invalid_id_rrr } from "../rrrs/invalid-user-id.rrr"

export const check_if_id_param_is_valid = (intake: Routary.Intake<TIDContext>) =>
	oath
		.of(intake.params.user_id)
		.pipe(id => oath.if(is_uid(id)))
		.pipe(oath.ops.rmap(() => invalid_id_rrr(intake.params.user_id, intake)))

const { is_uid } = CurrentUser.Validations
