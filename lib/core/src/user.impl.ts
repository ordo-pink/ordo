/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2024  谢尔盖 ||↓ and the Ordo.pink contributors
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

import * as tau from "@ordo-pink/tau"
import { sweech } from "@ordo-pink/sweech"

import { CURRENT_USER_KEYS, PUBLIC_USER_KEYS, USER_SUBSCRIPTION } from "./constants"

const can_user_add_function = (dto: Ordo.DTOLike<Ordo.User.Current.DTO>) => () =>
	dto[CURRENT_USER_KEYS.INSTALLED_FUNCTIONS].length < dto[CURRENT_USER_KEYS.MAX_FUNCTIONS]

const can_user_create_files = (dto: Ordo.DTOLike<Ordo.User.Current.DTO>) => (files: number) =>
	files <= dto[CURRENT_USER_KEYS.FILE_LIMIT]

const can_user_upload = (dto: Ordo.DTOLike<Ordo.User.Current.DTO>) => (bytes: number) =>
	bytes <= dto[CURRENT_USER_KEYS.MAX_UPLOAD_SIZE] * 1024 * 1024

const get_user_created_at = (dto: Ordo.DTOLike<Ordo.User.Public.DTO>) => () => new Date(dto[PUBLIC_USER_KEYS.CREATED_AT])

const get_user_email = (dto: Ordo.DTOLike<Ordo.User.Current.DTO>) => () => dto[CURRENT_USER_KEYS.EMAIL]

const get_user_file_limit = (dto: Ordo.DTOLike<Ordo.User.Current.DTO>) => () => dto[CURRENT_USER_KEYS.FILE_LIMIT]

const get_user_first_name = (dto: Ordo.DTOLike<Ordo.User.Public.DTO>) => () => dto[PUBLIC_USER_KEYS.FIRST_NAME] ?? ""

const get_user_full_name = (dto: Ordo.DTOLike<Ordo.User.Public.DTO>) => () =>
	sweech
		.of_true()
		.case(
			!!dto[PUBLIC_USER_KEYS.FIRST_NAME] && !!dto[PUBLIC_USER_KEYS.LAST_NAME],
			() => `${dto[PUBLIC_USER_KEYS.FIRST_NAME]} ${dto[PUBLIC_USER_KEYS.LAST_NAME]}`,
		)
		.case(!!dto[PUBLIC_USER_KEYS.FIRST_NAME], () => dto[PUBLIC_USER_KEYS.FIRST_NAME]!)
		.default(() => dto[PUBLIC_USER_KEYS.LAST_NAME]!)

const get_user_readable_name = (dto: Ordo.DTOLike<Ordo.User.Public.DTO>) => () =>
	get_user_full_name(dto)() ?? dto[PUBLIC_USER_KEYS.HANDLE].slice(1)

const get_user_handle = (dto: Ordo.DTOLike<Ordo.User.Public.DTO>) => () => dto[PUBLIC_USER_KEYS.HANDLE]

const get_user_id = (dto: Ordo.DTOLike<Ordo.User.Public.DTO>) => () => dto[PUBLIC_USER_KEYS.UID]

const get_user_installed_functions = (dto: Ordo.DTOLike<Ordo.User.Current.DTO>) => () =>
	dto[CURRENT_USER_KEYS.INSTALLED_FUNCTIONS]

const get_user_last_name = (dto: Ordo.DTOLike<Ordo.User.Public.DTO>) => () => dto[PUBLIC_USER_KEYS.LAST_NAME] ?? ""

const get_user_max_functions = (dto: Ordo.DTOLike<Ordo.User.Current.DTO>) => () => dto[CURRENT_USER_KEYS.MAX_FUNCTIONS]

const get_user_max_upload_size = (dto: Ordo.DTOLike<Ordo.User.Current.DTO>) => () => dto[CURRENT_USER_KEYS.MAX_UPLOAD_SIZE]

const get_user_subscription = (dto: Ordo.DTOLike<Ordo.User.Public.DTO>) => () => dto[PUBLIC_USER_KEYS.SUBSCRIPTION]

const is_user_newer_than = (dto: Ordo.DTOLike<Ordo.User.Public.DTO>) => (date: Date) => get_user_created_at(dto)() < date

const is_user_older_than = (dto: Ordo.DTOLike<Ordo.User.Public.DTO>) => (date: Date) => get_user_created_at(dto)() > date

const is_user_subscription_paid = (dto: Ordo.DTOLike<Ordo.User.Public.DTO>) => () =>
	dto[PUBLIC_USER_KEYS.SUBSCRIPTION] > USER_SUBSCRIPTION.FREE

export const current_user_validations: Ordo.User.Current.Validations = {
	is_created_at: (x): x is Ordo.User.Current.DTO[CURRENT_USER_KEYS.CREATED_AT] => tau.is_number(x),
	is_first_name: (x): x is Ordo.User.Current.DTO[CURRENT_USER_KEYS.FIRST_NAME] => tau.is_undefined(x) || tau.is_string(x),
	is_handle: (x): x is Ordo.User.Current.DTO[CURRENT_USER_KEYS.HANDLE] => tau.is_non_empty_string(x) && x.startsWith("@"),
	is_uid: (x): x is Ordo.User.Current.DTO[CURRENT_USER_KEYS.UID] => tau.is_uuid(x),
	is_last_name: (x): x is Ordo.User.Current.DTO[CURRENT_USER_KEYS.LAST_NAME] => tau.is_undefined(x) || tau.is_string(x),
	is_subscription: (x): x is Ordo.User.Current.DTO[CURRENT_USER_KEYS.SUBSCRIPTION] =>
		tau.is_number(x) && tau.gte(0)(x) && tau.lt(USER_SUBSCRIPTION.length)(x),
	is_email: (x): x is Ordo.User.Current.DTO[CURRENT_USER_KEYS.EMAIL] =>
		tau.is_string(x) &&
		// eslint-disable-next-line no-useless-escape
		/^[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(
			x,
		),
	is_file_limit: (x): x is Ordo.User.Current.DTO[CURRENT_USER_KEYS.FILE_LIMIT] => tau.is_positive_number(x),
	is_installed_functions: (x): x is Ordo.User.Current.DTO[CURRENT_USER_KEYS.INSTALLED_FUNCTIONS] =>
		tau.is_array(x) && tau.check_all(tau.is_non_empty_string, x),
	is_max_functions: (x): x is Ordo.User.Current.DTO[CURRENT_USER_KEYS.MAX_FUNCTIONS] => tau.is_finite_non_negative_int(x),
	is_max_upload_size: (x): x is Ordo.User.Current.DTO[CURRENT_USER_KEYS.MAX_UPLOAD_SIZE] => tau.is_non_negative_number(x),
	is_sessions: (x): x is Ordo.User.Current.DTO[CURRENT_USER_KEYS.SESSIONS] => {
		if (!tau.is_array(x)) return false

		for (const [sid, cat, dsc] of x as Ordo.User.Current.DTO[CURRENT_USER_KEYS.SESSIONS]) {
			if (
				!tau.is_uuid(sid) ||
				!tau.is_finite_non_negative_int(cat) ||
				(!tau.is_undefined(dsc) && !tau.is_non_empty_string(dsc))
			)
				return false
		}

		return true
	},
	is_dto: (x): x is Ordo.User.Current.DTO => {
		const y = x as Ordo.User.Current.DTO

		return (
			tau.is_array(y) &&
			current_user.validations.is_created_at(y[PUBLIC_USER_KEYS.CREATED_AT]) &&
			current_user.validations.is_first_name(y[PUBLIC_USER_KEYS.FIRST_NAME]) &&
			current_user.validations.is_handle(y[PUBLIC_USER_KEYS.HANDLE]) &&
			current_user.validations.is_uid(y[PUBLIC_USER_KEYS.UID]) &&
			current_user.validations.is_last_name(y[PUBLIC_USER_KEYS.LAST_NAME]) &&
			current_user.validations.is_subscription(y[PUBLIC_USER_KEYS.SUBSCRIPTION]) &&
			current_user.validations.is_email(y[CURRENT_USER_KEYS.EMAIL]) &&
			current_user.validations.is_file_limit(y[CURRENT_USER_KEYS.FILE_LIMIT]) &&
			current_user.validations.is_installed_functions(y[CURRENT_USER_KEYS.INSTALLED_FUNCTIONS]) &&
			current_user.validations.is_max_functions(y[CURRENT_USER_KEYS.MAX_FUNCTIONS]) &&
			current_user.validations.is_max_upload_size(y[CURRENT_USER_KEYS.MAX_UPLOAD_SIZE])
		)
	},
}

export const current_user: Ordo.User.Current.Static = {
	validations: current_user_validations,
	serialize: dto => [
		...public_user.serialize(dto),
		dto[CURRENT_USER_KEYS.EMAIL],
		dto[CURRENT_USER_KEYS.FILE_LIMIT],
		dto[CURRENT_USER_KEYS.INSTALLED_FUNCTIONS],
		dto[CURRENT_USER_KEYS.MAX_FUNCTIONS],
		dto[CURRENT_USER_KEYS.MAX_UPLOAD_SIZE],
		dto[CURRENT_USER_KEYS.SESSIONS],
	],
	from_dto: dto => ({
		can_add_function: can_user_add_function(dto),
		can_create_files: can_user_create_files(dto),
		can_upload: can_user_upload(dto),
		get_created_at: get_user_created_at(dto),
		get_email: get_user_email(dto),
		get_file_limit: get_user_file_limit(dto),
		get_first_name: get_user_first_name(dto),
		get_full_name: get_user_full_name(dto),
		get_handle: get_user_handle(dto),
		get_installed_functions: get_user_installed_functions(dto),
		get_last_name: get_user_last_name(dto),
		get_max_functions: get_user_max_functions(dto),
		get_max_upload_size: get_user_max_upload_size(dto),
		get_readable_name: get_user_readable_name(dto),
		get_sessions: () => dto[CURRENT_USER_KEYS.SESSIONS],
		get_subscription: get_user_subscription(dto),
		get_uid: get_user_id(dto),
		is_newer_than: is_user_newer_than(dto),
		is_older_than: is_user_older_than(dto),
		is_paid: is_user_subscription_paid(dto),
		to_dto: () =>
			[
				...public_user.serialize(dto),
				dto[CURRENT_USER_KEYS.EMAIL],
				dto[CURRENT_USER_KEYS.FILE_LIMIT],
				dto[CURRENT_USER_KEYS.INSTALLED_FUNCTIONS],
				dto[CURRENT_USER_KEYS.MAX_FUNCTIONS],
				dto[CURRENT_USER_KEYS.MAX_UPLOAD_SIZE],
				dto[CURRENT_USER_KEYS.SESSIONS],
			] as const,
	}),
	new: (email, file_limit, max_upload_size, max_functions, subscription = USER_SUBSCRIPTION.FREE) => {
		const uid = crypto.randomUUID()
		const handle = `@${email.split("@")[0].replaceAll(".", "_").replaceAll("/", "")}${uid.split("-")[0]}` as Ordo.User.Handle

		const user = [] as unknown as Ordo.User.Current.DTO

		user[CURRENT_USER_KEYS.UID] = uid
		user[CURRENT_USER_KEYS.HANDLE] = handle
		user[CURRENT_USER_KEYS.CREATED_AT] = Date.now()
		user[CURRENT_USER_KEYS.SUBSCRIPTION] = subscription
		user[CURRENT_USER_KEYS.FIRST_NAME] = ""
		user[CURRENT_USER_KEYS.LAST_NAME] = ""
		user[CURRENT_USER_KEYS.EMAIL] = email
		user[CURRENT_USER_KEYS.FILE_LIMIT] = file_limit
		user[CURRENT_USER_KEYS.INSTALLED_FUNCTIONS] = []
		user[CURRENT_USER_KEYS.MAX_FUNCTIONS] = max_functions
		user[CURRENT_USER_KEYS.MAX_UPLOAD_SIZE] = max_upload_size
		user[CURRENT_USER_KEYS.SESSIONS] = []

		return current_user.from_dto(user as Ordo.User.Current.DTO)
	},
}

export const public_user_validations: Ordo.User.Public.Validations = {
	is_created_at: (x): x is Ordo.User.Public.DTO[PUBLIC_USER_KEYS.CREATED_AT] => tau.is_date(x),
	is_first_name: (x): x is Ordo.User.Public.DTO[PUBLIC_USER_KEYS.FIRST_NAME] => tau.is_undefined(x) || tau.is_string(x),
	is_handle: (x): x is Ordo.User.Public.DTO[PUBLIC_USER_KEYS.HANDLE] => tau.is_non_empty_string(x) && x.startsWith("@"),
	is_uid: (x): x is Ordo.User.Public.DTO[PUBLIC_USER_KEYS.UID] => tau.is_uuid(x),
	is_last_name: (x): x is Ordo.User.Public.DTO[PUBLIC_USER_KEYS.LAST_NAME] => tau.is_undefined(x) || tau.is_string(x),
	is_subscription: (x): x is Ordo.User.Public.DTO[PUBLIC_USER_KEYS.SUBSCRIPTION] =>
		tau.is_number(x) && tau.gte(0)(x) && tau.lt(USER_SUBSCRIPTION.length)(x),
	is_dto: (x): x is Ordo.User.Public.DTO => {
		const y = x as Ordo.User.Public.DTO

		return (
			tau.is_array(y) &&
			public_user.validations.is_created_at(y[PUBLIC_USER_KEYS.CREATED_AT]) &&
			public_user.validations.is_first_name(y[PUBLIC_USER_KEYS.FIRST_NAME]) &&
			public_user.validations.is_handle(y[PUBLIC_USER_KEYS.HANDLE]) &&
			public_user.validations.is_uid(y[PUBLIC_USER_KEYS.UID]) &&
			public_user.validations.is_last_name(y[PUBLIC_USER_KEYS.LAST_NAME]) &&
			public_user.validations.is_subscription(y[PUBLIC_USER_KEYS.SUBSCRIPTION])
		)
	},
}

export const public_user: Ordo.User.Public.Static = {
	validations: public_user_validations,
	serialize: dto => [
		dto[PUBLIC_USER_KEYS.UID],
		dto[PUBLIC_USER_KEYS.HANDLE],
		dto[PUBLIC_USER_KEYS.CREATED_AT],
		dto[PUBLIC_USER_KEYS.SUBSCRIPTION],
		dto[PUBLIC_USER_KEYS.FIRST_NAME],
		dto[PUBLIC_USER_KEYS.LAST_NAME],
	],
	from_dto: dto => ({
		get_created_at: get_user_created_at(dto),
		get_first_name: get_user_first_name(dto),
		get_full_name: get_user_full_name(dto),
		get_handle: get_user_handle(dto),
		get_uid: get_user_id(dto),
		get_last_name: get_user_last_name(dto),
		get_readable_name: get_user_readable_name(dto),
		get_subscription: get_user_subscription(dto),
		is_newer_than: is_user_newer_than(dto),
		is_older_than: is_user_older_than(dto),
		is_paid: is_user_subscription_paid(dto),
		to_dto: () => public_user.serialize(dto),
	}),
}
