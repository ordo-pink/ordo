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
import { default_handler } from "@ordo-pink/backend-util-default-handler"

import { type TIDContext } from "../../backend-id.types"
import { check_if_edited_user_is_current_user } from "../../common/check-if-edited-user-is-current-user"
import { check_if_id_param_is_valid } from "../../common/validate-id-param"

export const handle_delete_user = default_handler<TIDContext>(intake =>
	Oath.Merge([check_if_edited_user_is_current_user(intake), check_if_id_param_is_valid(intake)])
		.and(() => intake.params.user_id as Ordo.User.ID)
		.and(id => intake.user_persistence_strategy.remove(id).pipe(ops0.rejected_map(rrr => ({ rrr, intake }))))
		.and(() => intake),
)
