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
import { BackendUserKeys } from "@ordo-pink/backend"
import { CurrentUser } from "@ordo-pink/core"
import { type TIntake } from "@ordo-pink/routary"
import { default_handler } from "@ordo-pink/backend-util-default-handler"
import { extract_request_body } from "@ordo-pink/backend-util-extract-body"

import { exists_by_email_rrr, invalid_email_rrr } from "../../rrrs/invalid-user-email.rrr"
import { exists_by_handle, invalid_handle_rrr } from "../../rrrs/invalid-user-handle.rrr"
import { invalid_first_name_rrr, invalid_installed_functions_rrr, invalid_last_name_rrr } from "../../rrrs/user-field.rrr"
import { type TIDContext } from "../../backend-id.types"
import { check_if_edited_user_is_current_user } from "../../common/check-if-edited-user-is-current-user"
import { check_if_id_param_is_valid } from "../../common/validate-id-param"

export const handle_update_user = default_handler<TIDContext>(intake =>
	Oath.Merge([check_if_edited_user_is_current_user(intake), check_if_id_param_is_valid(intake)])
		.pipe(ops0.chain(() => extract_request_body(intake)))
		.pipe(ops0.chain(valdiate_body(intake)))
		.pipe(ops0.chain(get_current_user(intake)))
		.pipe(ops0.map(merge_users))
		.pipe(ops0.chain(update_user(intake.params.user_id as Ordo.User.UID, intake)))
		.pipe(ops0.map(() => intake)),
)

// --- Internal ---

const { is_email, is_handle, is_installed_functions, is_first_name, is_last_name } = CurrentUser.Validations

type I = TIntake<TIDContext>

const check_email_is_not_taken_if_present = (body: Record<string, any>, i: I) =>
	body.email
		? Oath.If(is_email(body.email), { F: () => invalid_email_rrr(body.email, i) })
				.and(() => body.email as Ordo.User.Email)
				.pipe(ops0.chain(email => i.user_persistence_strategy.get_by_email(email).fix(() => null)))
				.pipe(
					ops0.chain(user =>
						Oath.If(!user || user[BackendUserKeys.UID] === i.params.user_id, { F: () => exists_by_email_rrr(body.email, i) }),
					),
				)
		: Oath.Resolve(void 0)

const check_handle_is_not_taken_if_present = (body: Record<string, any>, i: I) =>
	body.handle
		? Oath.If(is_handle(body.handle), { F: () => invalid_handle_rrr(body.handle, i) })
				.and(() => body.handle as Ordo.User.Handle)
				.pipe(ops0.chain(handle => i.user_persistence_strategy.get_by_handle(handle).fix(() => null)))
				.pipe(
					ops0.chain(user =>
						Oath.If(!user || user[BackendUserKeys.UID] === i.params.user_id, { F: () => exists_by_handle(body.handle, i) }),
					),
				)
		: Oath.Resolve(void 0)

const check_installed_functions_is_valid_if_present = (body: Record<string, any>, i: I) =>
	body.installed_functions
		? Oath.If(is_installed_functions(body.installed_functions), {
				F: () => invalid_installed_functions_rrr(body.installed_functions, i),
			})
		: Oath.Resolve(void 0)

const check_first_name_is_valid_if_present = (body: Record<string, any>, i: I) =>
	body.first_name
		? Oath.If(is_first_name(body.first_name), { F: () => invalid_first_name_rrr(body.first_name, i) })
		: Oath.Resolve(void 0)

const check_last_name_is_valid_if_present = (body: Record<string, any>, i: I) =>
	body.last_name
		? Oath.If(is_last_name(body.last_name), { F: () => invalid_last_name_rrr(body.last_name, i) })
		: Oath.Resolve(void 0)

const valdiate_body = (i: I) => (body: Record<string, any>) =>
	Oath.Merge([
		check_email_is_not_taken_if_present(body, i),
		check_handle_is_not_taken_if_present(body, i),
		check_installed_functions_is_valid_if_present(body, i),
		check_first_name_is_valid_if_present(body, i),
		check_last_name_is_valid_if_present(body, i),
	]).pipe(ops0.map(() => body as Partial<OrdoBackend.User.DTO>))

const get_current_user = (i: I) => (updated_user: Partial<OrdoBackend.User.DTO>) =>
	i.user_persistence_strategy
		.get_by_id(i.params.user_id as Ordo.User.UID)
		.pipe(ops0.rejected_map(rrr => ({ rrr, intake: i })))
		.pipe(ops0.map(user => ({ user, updated_user })))

const update_user = (id: Ordo.User.UID, intake: I) => (user: OrdoBackend.User.DTO) =>
	intake.user_persistence_strategy.update(id, user).pipe(ops0.rejected_map(rrr => ({ rrr, intake })))

const merge_users = (users: {
	user: OrdoBackend.User.DTO
	updated_user: Partial<OrdoBackend.User.DTO>
}): OrdoBackend.User.DTO => ({
	[BackendUserKeys.CREATED_AT]: users.user[BackendUserKeys.CREATED_AT],
	[BackendUserKeys.EMAIL_CODE]: users.user[BackendUserKeys.EMAIL_CODE],
	[BackendUserKeys.FILE_LIMIT]: users.user[BackendUserKeys.FILE_LIMIT],
	[BackendUserKeys.UID]: users.user[BackendUserKeys.UID],
	[BackendUserKeys.MAX_FUNCTIONS]: users.user[BackendUserKeys.MAX_FUNCTIONS],
	[BackendUserKeys.MAX_UPLOAD_SIZE]: users.user[BackendUserKeys.MAX_UPLOAD_SIZE],
	[BackendUserKeys.PASSWORD]: users.user[BackendUserKeys.PASSWORD],
	[BackendUserKeys.SUBSCRIPTION]: users.user[BackendUserKeys.SUBSCRIPTION],
	[BackendUserKeys.EMAIL]: users.updated_user[BackendUserKeys.EMAIL] ?? users.user[BackendUserKeys.EMAIL],
	[BackendUserKeys.FIRST_NAME]: users.updated_user[BackendUserKeys.FIRST_NAME] ?? users.user[BackendUserKeys.FIRST_NAME],
	[BackendUserKeys.HANDLE]: users.updated_user[BackendUserKeys.HANDLE] ?? users.user[BackendUserKeys.HANDLE],
	[BackendUserKeys.INSTALLED_FUNCTIONS]:
		users.updated_user[BackendUserKeys.INSTALLED_FUNCTIONS] ?? users.user[BackendUserKeys.INSTALLED_FUNCTIONS],
	[BackendUserKeys.LAST_NAME]: users.updated_user[BackendUserKeys.LAST_NAME] ?? users.user[BackendUserKeys.LAST_NAME],
	[BackendUserKeys.SESSIONS]: users.user[BackendUserKeys.SESSIONS],
})
