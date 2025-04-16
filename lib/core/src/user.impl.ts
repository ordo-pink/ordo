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

import * as TAU from "@ordo-pink/tau"
import { sweech } from "@ordo-pink/sweech"

import { CurrentUserKeys, PublicUserKeys, UserSubscription } from "./constants"

const can_user_add_function = (dto: Ordo.DTOLike<Ordo.User.Current.DTO>) => () =>
	dto[CurrentUserKeys.INSTALLED_FUNCTIONS].length < dto[CurrentUserKeys.MAX_FUNCTIONS]

const can_user_create_files = (dto: Ordo.DTOLike<Ordo.User.Current.DTO>) => (files: number) =>
	files <= dto[CurrentUserKeys.FILE_LIMIT]

const can_user_upload = (dto: Ordo.DTOLike<Ordo.User.Current.DTO>) => (bytes: number) =>
	bytes <= dto[CurrentUserKeys.MAX_UPLOAD_SIZE] * 1024 * 1024

const get_user_created_at = (dto: Ordo.DTOLike<Ordo.User.Public.DTO>) => () => new Date(dto[PublicUserKeys.CREATED_AT])

const get_user_email = (dto: Ordo.DTOLike<Ordo.User.Current.DTO>) => () => dto[CurrentUserKeys.EMAIL]

const get_user_file_limit = (dto: Ordo.DTOLike<Ordo.User.Current.DTO>) => () => dto[CurrentUserKeys.FILE_LIMIT]

const get_user_first_name = (dto: Ordo.DTOLike<Ordo.User.Public.DTO>) => () => dto[PublicUserKeys.FIRST_NAME] ?? ""

const get_user_full_name = (dto: Ordo.DTOLike<Ordo.User.Public.DTO>) => () =>
	sweech
		.of_true()
		.case(
			!!dto[PublicUserKeys.FIRST_NAME] && !!dto[PublicUserKeys.LAST_NAME],
			() => `${dto[PublicUserKeys.FIRST_NAME]} ${dto[PublicUserKeys.LAST_NAME]}`,
		)
		.case(!!dto[PublicUserKeys.FIRST_NAME], () => dto[PublicUserKeys.FIRST_NAME]!)
		.default(() => dto[PublicUserKeys.LAST_NAME]!)

const get_user_readable_name = (dto: Ordo.DTOLike<Ordo.User.Public.DTO>) => () =>
	get_user_full_name(dto)() ?? dto[PublicUserKeys.HANDLE].slice(1)

const get_user_handle = (dto: Ordo.DTOLike<Ordo.User.Public.DTO>) => () => dto[PublicUserKeys.HANDLE]

const get_user_id = (dto: Ordo.DTOLike<Ordo.User.Public.DTO>) => () => dto[PublicUserKeys.UID]

const get_user_installed_functions = (dto: Ordo.DTOLike<Ordo.User.Current.DTO>) => () =>
	dto[CurrentUserKeys.INSTALLED_FUNCTIONS]

const get_user_last_name = (dto: Ordo.DTOLike<Ordo.User.Public.DTO>) => () => dto[PublicUserKeys.LAST_NAME] ?? ""

const get_user_max_functions = (dto: Ordo.DTOLike<Ordo.User.Current.DTO>) => () => dto[CurrentUserKeys.MAX_FUNCTIONS]

const get_user_max_upload_size = (dto: Ordo.DTOLike<Ordo.User.Current.DTO>) => () => dto[CurrentUserKeys.MAX_UPLOAD_SIZE]

const get_user_subscription = (dto: Ordo.DTOLike<Ordo.User.Public.DTO>) => () => dto[PublicUserKeys.SUBSCRIPTION]

const is_user_newer_than = (dto: Ordo.DTOLike<Ordo.User.Public.DTO>) => (date: Date) => get_user_created_at(dto)() < date

const is_user_older_than = (dto: Ordo.DTOLike<Ordo.User.Public.DTO>) => (date: Date) => get_user_created_at(dto)() > date

const is_user_subscription_paid = (dto: Ordo.DTOLike<Ordo.User.Public.DTO>) => () =>
	dto[PublicUserKeys.SUBSCRIPTION] > UserSubscription.FREE

export const CurrentUserValidations: Ordo.User.Current.Validations = {
	is_created_at: (x): x is Ordo.User.Current.DTO[CurrentUserKeys.CREATED_AT] => TAU.is_number(x),
	is_first_name: (x): x is Ordo.User.Current.DTO[CurrentUserKeys.FIRST_NAME] => TAU.is_undefined(x) || TAU.is_string(x),
	is_handle: (x): x is Ordo.User.Current.DTO[CurrentUserKeys.HANDLE] => TAU.is_non_empty_string(x) && x.startsWith("@"),
	is_uid: (x): x is Ordo.User.Current.DTO[CurrentUserKeys.UID] => TAU.is_uuid(x),
	is_last_name: (x): x is Ordo.User.Current.DTO[CurrentUserKeys.LAST_NAME] => TAU.is_undefined(x) || TAU.is_string(x),
	is_subscription: (x): x is Ordo.User.Current.DTO[CurrentUserKeys.SUBSCRIPTION] =>
		TAU.is_number(x) && TAU.gte(0)(x) && TAU.lt(UserSubscription.length)(x),
	is_email: (x): x is Ordo.User.Current.DTO[CurrentUserKeys.EMAIL] =>
		TAU.is_string(x) &&
		// eslint-disable-next-line no-useless-escape
		/^[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(
			x,
		),
	is_file_limit: (x): x is Ordo.User.Current.DTO[CurrentUserKeys.FILE_LIMIT] => TAU.is_positive_number(x),
	is_installed_functions: (x): x is Ordo.User.Current.DTO[CurrentUserKeys.INSTALLED_FUNCTIONS] =>
		TAU.is_array(x) && TAU.check_all(TAU.is_non_empty_string, x),
	is_max_functions: (x): x is Ordo.User.Current.DTO[CurrentUserKeys.MAX_FUNCTIONS] => TAU.is_finite_non_negative_int(x),
	is_max_upload_size: (x): x is Ordo.User.Current.DTO[CurrentUserKeys.MAX_UPLOAD_SIZE] => TAU.is_non_negative_number(x),
	is_sessions: (x): x is Ordo.User.Current.DTO[CurrentUserKeys.SESSIONS] => {
		if (!TAU.is_array(x)) return false

		for (const [sid, cat, dsc] of x as Ordo.User.Current.DTO[CurrentUserKeys.SESSIONS]) {
			if (
				!TAU.is_uuid(sid) ||
				!TAU.is_finite_non_negative_int(cat) ||
				(!TAU.is_undefined(dsc) && !TAU.is_non_empty_string(dsc))
			)
				return false
		}

		return true
	},
	is_dto: (x): x is Ordo.User.Current.DTO => {
		const y = x as Ordo.User.Current.DTO

		return (
			TAU.is_array(y) &&
			CurrentUser.Validations.is_created_at(y[PublicUserKeys.CREATED_AT]) &&
			CurrentUser.Validations.is_first_name(y[PublicUserKeys.FIRST_NAME]) &&
			CurrentUser.Validations.is_handle(y[PublicUserKeys.HANDLE]) &&
			CurrentUser.Validations.is_uid(y[PublicUserKeys.UID]) &&
			CurrentUser.Validations.is_last_name(y[PublicUserKeys.LAST_NAME]) &&
			CurrentUser.Validations.is_subscription(y[PublicUserKeys.SUBSCRIPTION]) &&
			CurrentUser.Validations.is_email(y[CurrentUserKeys.EMAIL]) &&
			CurrentUser.Validations.is_file_limit(y[CurrentUserKeys.FILE_LIMIT]) &&
			CurrentUser.Validations.is_installed_functions(y[CurrentUserKeys.INSTALLED_FUNCTIONS]) &&
			CurrentUser.Validations.is_max_functions(y[CurrentUserKeys.MAX_FUNCTIONS]) &&
			CurrentUser.Validations.is_max_upload_size(y[CurrentUserKeys.MAX_UPLOAD_SIZE])
		)
	},
}

export const CurrentUser: Ordo.User.Current.Static = {
	Validations: CurrentUserValidations,
	Serialize: dto => [
		...PublicUser.Serialize(dto),
		dto[CurrentUserKeys.EMAIL],
		dto[CurrentUserKeys.FILE_LIMIT],
		dto[CurrentUserKeys.INSTALLED_FUNCTIONS],
		dto[CurrentUserKeys.MAX_FUNCTIONS],
		dto[CurrentUserKeys.MAX_UPLOAD_SIZE],
		dto[CurrentUserKeys.SESSIONS],
	],
	FromDTO: dto => ({
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
		get_sessions: () => dto[CurrentUserKeys.SESSIONS],
		get_subscription: get_user_subscription(dto),
		get_uid: get_user_id(dto),
		is_newer_than: is_user_newer_than(dto),
		is_older_than: is_user_older_than(dto),
		is_paid: is_user_subscription_paid(dto),
		to_dto: () =>
			[
				...PublicUser.Serialize(dto),
				dto[CurrentUserKeys.EMAIL],
				dto[CurrentUserKeys.FILE_LIMIT],
				dto[CurrentUserKeys.INSTALLED_FUNCTIONS],
				dto[CurrentUserKeys.MAX_FUNCTIONS],
				dto[CurrentUserKeys.MAX_UPLOAD_SIZE],
				dto[CurrentUserKeys.SESSIONS],
			] as const,
	}),
	Create: (email, file_limit, max_upload_size, max_functions, subscription = UserSubscription.FREE) => {
		const uid = crypto.randomUUID()
		const handle = `@${email.split("@")[0].replaceAll(".", "_").replaceAll("/", "")}${uid.split("-")[0]}` as Ordo.User.Handle

		const user = []

		user[CurrentUserKeys.UID] = uid
		user[CurrentUserKeys.HANDLE] = handle
		user[CurrentUserKeys.CREATED_AT] = Date.now()
		user[CurrentUserKeys.SUBSCRIPTION] = subscription
		user[CurrentUserKeys.FIRST_NAME] = 0
		user[CurrentUserKeys.LAST_NAME] = 0
		user[CurrentUserKeys.EMAIL] = email
		user[CurrentUserKeys.FILE_LIMIT] = file_limit
		user[CurrentUserKeys.INSTALLED_FUNCTIONS] = []
		user[CurrentUserKeys.MAX_FUNCTIONS] = max_functions
		user[CurrentUserKeys.MAX_UPLOAD_SIZE] = max_upload_size
		user[CurrentUserKeys.SESSIONS] = []

		return CurrentUser.FromDTO(user as Ordo.User.Current.DTO)
	},
}

export const PublicUserValidations: Ordo.User.Public.Validations = {
	is_created_at: (x): x is Ordo.User.Public.DTO[PublicUserKeys.CREATED_AT] => TAU.is_date(x),
	is_first_name: (x): x is Ordo.User.Public.DTO[PublicUserKeys.FIRST_NAME] => TAU.is_undefined(x) || TAU.is_string(x),
	is_handle: (x): x is Ordo.User.Public.DTO[PublicUserKeys.HANDLE] => TAU.is_non_empty_string(x) && x.startsWith("@"),
	is_uid: (x): x is Ordo.User.Public.DTO[PublicUserKeys.UID] => TAU.is_uuid(x),
	is_last_name: (x): x is Ordo.User.Public.DTO[PublicUserKeys.LAST_NAME] => TAU.is_undefined(x) || TAU.is_string(x),
	is_subscription: (x): x is Ordo.User.Public.DTO[PublicUserKeys.SUBSCRIPTION] =>
		TAU.is_number(x) && TAU.gte(0)(x) && TAU.lt(UserSubscription.length)(x),
	is_dto: (x): x is Ordo.User.Public.DTO => {
		const y = x as Ordo.User.Public.DTO

		return (
			TAU.is_array(y) &&
			PublicUser.Validations.is_created_at(y[PublicUserKeys.CREATED_AT]) &&
			PublicUser.Validations.is_first_name(y[PublicUserKeys.FIRST_NAME]) &&
			PublicUser.Validations.is_handle(y[PublicUserKeys.HANDLE]) &&
			PublicUser.Validations.is_uid(y[PublicUserKeys.UID]) &&
			PublicUser.Validations.is_last_name(y[PublicUserKeys.LAST_NAME]) &&
			PublicUser.Validations.is_subscription(y[PublicUserKeys.SUBSCRIPTION])
		)
	},
}

export const PublicUser: Ordo.User.Public.Static = {
	Validations: PublicUserValidations,
	Serialize: dto => [
		dto[PublicUserKeys.UID],
		dto[PublicUserKeys.HANDLE],
		dto[PublicUserKeys.CREATED_AT],
		dto[PublicUserKeys.SUBSCRIPTION],
		dto[PublicUserKeys.FIRST_NAME],
		dto[PublicUserKeys.LAST_NAME],
	],
	FromDTO: dto => ({
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
		to_dto: () => PublicUser.Serialize(dto),
	}),
}
