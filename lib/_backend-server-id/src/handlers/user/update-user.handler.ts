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

import { current_user, CURRENT_USER_KEYS } from "@ordo-pink/_core"
import { default_handler, extract_json_body } from "@ordo-pink/sdk-server-routary"
import { type Routary } from "@ordo-pink/oss-routary"
import { oath } from "@ordo-pink/oss-oath"

import { exists_by_email_rrr, invalid_email_rrr } from "../../rrrs/invalid-user-email.rrr"
import { exists_by_handle, invalid_handle_rrr } from "../../rrrs/invalid-user-handle.rrr"
import { invalid_first_name_rrr, invalid_installed_functions_rrr, invalid_last_name_rrr } from "../../rrrs/user-field.rrr"
import { type TIDContext } from "../../backend-server-id.types"
import { check_if_edited_user_is_current_user } from "../../common/check-if-edited-user-is-current-user"
import { check_if_id_param_is_valid } from "../../common/validate-id-param"

export const handle_update_user = default_handler<TIDContext>(intake =>
	oath
		.all([check_if_edited_user_is_current_user(intake), check_if_id_param_is_valid(intake)])
		.pipe(oath.ops.chain(() => extract_json_body(intake)))
		.pipe(oath.ops.chain(valdiate_body(intake)))
		.pipe(oath.ops.chain(get_current_user(intake)))
		.pipe(oath.ops.map(merge_users))
		.pipe(oath.ops.chain(update_user(intake.params.user_id as Ordo.User.UID, intake)))
		.pipe(oath.ops.map(() => intake)),
)

// --- Internal ---

const { is_email, is_handle, is_installed_functions, is_first_name, is_last_name } = current_user.validations

type I = Routary.Intake<TIDContext>

const check_email_is_not_taken_if_present = (body: Record<string, any>, i: I) =>
	body.email
		? oath
				.if(is_email(body.email), { on_false: () => invalid_email_rrr(body.email, i) })
				.pipe(oath.ops.map(() => body.email as Ordo.User.Email))
				.pipe(oath.ops.chain(email => i.reference_mapping_user.get_by_email(email).pipe(oath.ops.fix(() => null))))
				.pipe(
					oath.ops.chain(id => oath.if(!id || id === i.params.user_id, { on_false: () => exists_by_email_rrr(body.email, i) })),
				)
		: oath.of(void 0)

const check_handle_is_not_taken_if_present = (body: Record<string, any>, i: I) =>
	body.handle
		? oath
				.if(is_handle(body.handle), { on_false: () => invalid_handle_rrr(body.handle, i) })
				.pipe(oath.ops.map(() => body.handle as Ordo.User.Handle))
				.pipe(oath.ops.chain(handle => i.reference_mapping_user.get_by_handle(handle).pipe(oath.ops.fix(() => null))))
				.pipe(
					oath.ops.chain(id => oath.if(!id || id === i.params.user_id, { on_false: () => exists_by_handle(body.handle, i) })),
				)
		: oath.of(void 0)

const check_installed_functions_is_valid_if_present = (body: Record<string, any>, i: I) =>
	body.installed_functions
		? oath.if(is_installed_functions(body.installed_functions), {
				on_false: () => invalid_installed_functions_rrr(body.installed_functions, i),
			})
		: oath.of(void 0)

const check_first_name_is_valid_if_present = (body: Record<string, any>, i: I) =>
	body.first_name
		? oath.if(is_first_name(body.first_name), { on_false: () => invalid_first_name_rrr(body.first_name, i) })
		: oath.of(void 0)

const check_last_name_is_valid_if_present = (body: Record<string, any>, i: I) =>
	body.last_name
		? oath.if(is_last_name(body.last_name), { on_false: () => invalid_last_name_rrr(body.last_name, i) })
		: oath.of(void 0)

const valdiate_body = (i: I) => (body: any) =>
	oath
		.all([
			check_email_is_not_taken_if_present(body, i),
			check_handle_is_not_taken_if_present(body, i),
			check_installed_functions_is_valid_if_present(body, i),
			check_first_name_is_valid_if_present(body, i),
			check_last_name_is_valid_if_present(body, i),
		])
		.pipe(oath.ops.map(() => body as Partial<Ordo.User.Current.DTO>))

const get_current_user = (i: I) => (updated_user: Partial<Ordo.User.Current.DTO>) =>
	i.persistence_strategy_user
		.read(i.params.user_id as Ordo.User.UID)
		.pipe(oath.ops.rmap(rrr => ({ rrr, intake: i })))
		.pipe(oath.ops.map(user => ({ user, updated_user })))

const update_user = (id: Ordo.User.UID, intake: I) => (user: Ordo.User.Current.DTO) =>
	intake.persistence_strategy_user.update(id, current_user.from_dto(user)).pipe(oath.ops.rmap(rrr => ({ rrr, intake })))

const merge_users = (users: {
	user: Ordo.User.Current.Instance
	updated_user: Partial<Ordo.User.Current.DTO>
}): Ordo.User.Current.DTO => [
	users.user.to_dto()[CURRENT_USER_KEYS.UID],
	users.updated_user[CURRENT_USER_KEYS.HANDLE] ?? users.user.to_dto()[CURRENT_USER_KEYS.HANDLE],
	users.user.to_dto()[CURRENT_USER_KEYS.CREATED_AT],
	users.user.to_dto()[CURRENT_USER_KEYS.SUBSCRIPTION],
	users.updated_user[CURRENT_USER_KEYS.FIRST_NAME] ?? users.user.to_dto()[CURRENT_USER_KEYS.FIRST_NAME],
	users.updated_user[CURRENT_USER_KEYS.LAST_NAME] ?? users.user.to_dto()[CURRENT_USER_KEYS.LAST_NAME],
	users.updated_user[CURRENT_USER_KEYS.EMAIL] ?? users.user.to_dto()[CURRENT_USER_KEYS.EMAIL],
	users.user.to_dto()[CURRENT_USER_KEYS.FILE_LIMIT],
	users.updated_user[CURRENT_USER_KEYS.INSTALLED_FUNCTIONS] ?? users.user.to_dto()[CURRENT_USER_KEYS.INSTALLED_FUNCTIONS],
	users.user.to_dto()[CURRENT_USER_KEYS.MAX_FUNCTIONS],
	users.user.to_dto()[CURRENT_USER_KEYS.MAX_UPLOAD_SIZE],
	users.user.to_dto()[CURRENT_USER_KEYS.SESSIONS],
]
