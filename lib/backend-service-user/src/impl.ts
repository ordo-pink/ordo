// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import isEmail from "validator/lib/isEmail"

import { O, type TOption } from "@ordo-pink/option"
import {
	UUIDv4,
	from_option0,
	is_int,
	is_non_empty_string,
	is_positive_number,
	is_string,
	is_uuid,
	noop,
	override,
} from "@ordo-pink/tau"
import { Oath } from "@ordo-pink/oath"
import { RRR } from "@ordo-pink/data"
import { okpwd } from "@ordo-pink/okpwd"

import { type TUserServiceStatic } from "./types"

export const serialise_public = ({
	created_at,
	email,
	handle,
	subscription,
	first_name,
	last_name,
}: User.PublicUser): User.PublicUser => ({
	created_at,
	email,
	handle,
	subscription,
	first_name,
	last_name,
})

const serialise = ({
	created_at,
	email,
	email_confirmed,
	file_limit,
	handle,
	id,
	max_functions,
	max_upload_size,
	subscription,
	first_name,
	last_name,
}: User.User): User.User => ({
	created_at,
	email,
	email_confirmed,
	file_limit,
	handle,
	id,
	max_functions,
	max_upload_size,
	subscription,
	first_name,
	last_name,
})

export const serialise_internal = ({
	created_at,
	email,
	email_confirmed,
	file_limit,
	handle,
	id,
	max_functions,
	max_upload_size,
	subscription,
	email_code,
	first_name,
	last_name,
}: User.InternalUser): User.InternalUser => ({
	created_at,
	email,
	email_confirmed,
	file_limit,
	handle,
	id,
	max_functions,
	max_upload_size,
	subscription,
	email_code,
	first_name,
	last_name,
})

const create_id = (): UUIDv4 => crypto.randomUUID()

const create_email_code = (): string => crypto.getRandomValues(new Uint16Array(3)).join("")

const obfuscate_email = (email: User.User["email"]): string => {
	const [local_part, domain_part] = email.split("@")

	const top_level_domain_start_index = domain_part.lastIndexOf(".")

	const higher_level_domain = domain_part.slice(0, top_level_domain_start_index)
	const top_level_domain = domain_part.slice(top_level_domain_start_index)

	const local_trim_size = local_part.length > 5 ? 4 : local_part.length > 2 ? 2 : 0
	const domain_trim_size =
		higher_level_domain.length > 5 ? 4 : higher_level_domain.length > 2 ? 2 : 0

	return local_part
		.slice(0, local_trim_size / 2)
		.concat("*".repeat(local_part.length - local_trim_size))
		.concat(local_trim_size ? local_part.slice(-local_trim_size / 2) : "")
		.concat("@")
		.concat(higher_level_domain.slice(0, domain_trim_size / 2))
		.concat("*".repeat(higher_level_domain.length - domain_trim_size))
		.concat(domain_trim_size ? higher_level_domain.slice(-domain_trim_size / 2) : "")
		.concat(top_level_domain)
}

export const UserService: TUserServiceStatic = {
	serialise,
	serialise_internal,
	serialise_public,
	obfuscate_email,
	create_id,
	create_email_code,

	of: strategy => ({
		strategy,

		compare_password: (email, password) =>
			Oath.Merge([_check_email0(email), _check_password0(password)])
				.pipe(Oath.ops.chain(() => strategy.get_by_email(email)))
				.pipe(Oath.ops.chain(from_option(() => enoent(`compare_password -> email: ${email}`))))
				.pipe(Oath.ops.chain(_verify_password0(password))),

		create: (email, handle, password) =>
			Oath.Merge([_check_email0(email), _check_password0(password), _check_handle0(handle)])
				.pipe(Oath.ops.chain(_hash_password0(password)))
				.pipe(
					Oath.ops.map(
						password =>
							({
								id: UserService.create_id(),
								email,
								handle,
								password,
								email_confirmed: false,
								created_at: new Date(Date.now()),
								file_limit: 1000,
								max_upload_size: 1.5,
								subscription: "free",
								max_functions: 5,
								email_code: UserService.create_email_code(),
								first_name: "",
								last_name: "",
							}) satisfies User.PrivateUser,
					),
				)
				.pipe(Oath.ops.chain(user => strategy.create(user).pipe(Oath.ops.map(() => user))))
				.pipe(Oath.ops.map(UserService.serialise_internal)),

		get_by_email: email =>
			_check_email0(email)
				.pipe(() => strategy.get_by_email(email))
				.pipe(Oath.ops.map(option => option.pipe(O.ops.map(serialise_public)))),

		get_by_handle: handle =>
			_check_handle0(handle)
				.pipe(() => strategy.get_by_handle(handle))
				.pipe(Oath.ops.map(option => option.pipe(O.ops.map(serialise_public)))),

		get_by_id: id =>
			_check_id0(id)
				.pipe(() => strategy.get_by_id(id))
				.pipe(Oath.ops.map(option => option.pipe(O.ops.map(serialise_internal)))),

		update_email: (id, email) =>
			Oath.Merge([
				_check_id0(id),
				_check_email0(email),
				strategy
					.exists_by_email(email)
					.pipe(
						Oath.ops.chain(exists =>
							Oath.If(exists, { F: () => eexist(`update_email -> email: ${email}`) }),
						),
					),
			])
				.pipe(Oath.ops.chain(() => strategy.get_by_id(id)))
				.pipe(Oath.ops.chain(from_option(() => enoent(`update_email -> id: ${id}`))))
				.pipe(
					Oath.ops.map(
						override({
							email,
							email_code: UserService.create_email_code(),
							email_confirmed: false,
						}),
					),
				)
				.pipe(Oath.ops.chain(user => strategy.update(id, user)))
				.pipe(Oath.ops.map(user => user.email_code)),

		update_handle: (id, handle) =>
			Oath.Merge([
				_check_id0(id),
				_check_handle0(handle),
				strategy
					.exists_by_handle(handle)
					.pipe(
						Oath.ops.chain(exists =>
							Oath.If(exists, { F: () => eexist(`update_handle -> handle: ${handle}`) }),
						),
					),
			])
				.pipe(Oath.ops.chain(() => strategy.get_by_id(id)))
				.pipe(Oath.ops.chain(from_option(() => enoent(`update_handle -> id: ${id}`))))
				.pipe(Oath.ops.map(override({ handle })))
				.pipe(Oath.ops.chain(user => strategy.update(id, user)))
				.pipe(Oath.ops.map(noop)),

		update_info: (id, { first_name, last_name }) =>
			Oath.Merge([_check_id0(id), _check_first_name0(first_name), _check_last_name0(last_name)])
				.pipe(Oath.ops.chain(() => strategy.get_by_id(id)))
				.pipe(Oath.ops.chain(from_option(() => enoent(`update_info -> id: ${id}`))))
				.pipe(Oath.ops.map(override({ first_name, last_name })))
				.pipe(Oath.ops.chain(user => strategy.update(id, user)))
				.pipe(Oath.ops.map(noop)),

		update_password: (id, old_password, new_password) =>
			Oath.Merge([_check_id0(id), _check_password0(old_password), _check_password0(new_password)])
				.pipe(Oath.ops.chain(() => strategy.get_by_id(id)))
				.pipe(Oath.ops.chain(from_option(() => enoent(`update_password -> id: ${id}`))))
				.pipe(
					Oath.ops.chain(user =>
						Oath.Resolve(user)
							.pipe(Oath.ops.chain(_verify_password0(old_password)))
							.pipe(
								Oath.ops.chain(is_valid =>
									Oath.If(is_valid, { T: () => user, F: () => enoent("update_password") }),
								),
							),
					),
				)
				.pipe(
					Oath.ops.chain(user =>
						_hash_password0(new_password)().pipe(Oath.ops.map(password => ({ ...user, password }))),
					),
				)
				.pipe(Oath.ops.chain(user => strategy.update(id, user)))
				.pipe(Oath.ops.map(noop)),

		update_subscription: (id, { file_limit, max_functions, max_upload_size, subscription }) =>
			Oath.Merge([
				_check_id0(id),
				_check_file_limit0(file_limit),
				_check_max_functions0(max_functions),
				_check_max_upload_size0(max_upload_size),
				_check_subscription0(subscription),
			])
				.pipe(Oath.ops.chain(() => strategy.get_by_id(id)))
				.pipe(Oath.ops.chain(from_option0(() => enoent(`update_info -> id: ${id}`))))
				.pipe(Oath.ops.map(override({ file_limit, max_functions, max_upload_size, subscription })))
				.pipe(Oath.ops.chain(user => strategy.update(id, user)))
				.pipe(Oath.ops.map(noop)),
	}),
}

// --- Internal ---

const LOCATION = "UserService"

const enoent = RRR.codes.enoent(LOCATION)
const einval = RRR.codes.einval(LOCATION)
const eexist = RRR.codes.einval(LOCATION)
const eio = RRR.codes.eio(LOCATION)

const _check_id0 = (id: User.User["id"]) =>
	Oath.If(is_uuid(id), { F: () => einval(`check_id -> id: ${id}`) })

const _check_email0 = (email: User.User["email"]) =>
	Oath.If(isEmail(email), { F: () => einval(`check_email -> email: ${email}`) })

const _check_handle0 = (handle: User.User["handle"]) =>
	Oath.If(is_non_empty_string(handle), { F: () => einval(`check_handle -> handle: ${handle}`) })

const _check_first_name0 = (first_name: User.User["first_name"]) =>
	Oath.If(is_string(first_name), {
		F: () => einval(`check_first_name -> first_name: ${first_name}`),
	})

const _check_last_name0 = (last_name: User.User["last_name"]) =>
	Oath.If(is_string(last_name), { F: () => einval(`check_last_name -> last_name: ${last_name}`) })

const _check_file_limit0 = (file_limit: User.User["file_limit"]) =>
	Oath.If(is_positive_number(file_limit) && is_int(file_limit), {
		F: () => einval(`check_file_limit -> file_limit: ${file_limit}`),
	})

const _check_max_functions0 = (max_functions: User.User["max_functions"]) =>
	Oath.If(is_positive_number(max_functions) && is_int(max_functions), {
		F: () => einval(`check_max_functions -> max_functions: ${max_functions}`),
	})

const _check_max_upload_size0 = (max_upload_size: User.User["max_upload_size"]) =>
	Oath.If(is_positive_number(max_upload_size), {
		F: () => einval(`check_max_upload_size -> max_upload_size: ${max_upload_size}`),
	})

const _check_subscription0 = (subscription: User.User["subscription"]) =>
	Oath.If(is_non_empty_string(subscription), {
		F: () => einval(`check_subscription -> subscription: ${subscription}`),
	})

const _check_password0 = (password: User.PrivateUser["password"]) =>
	Oath.Resolve(okpwd())
		.pipe(Oath.ops.map(check => check(password)))
		.pipe(
			Oath.ops.chain(error =>
				Oath.If(!error, { F: () => einval(`check_password -> error: ${error}`) }),
			),
		)

const _hash_password0 = (password: User.PrivateUser["password"]) => () =>
	Oath.FromPromise(() => Bun.password.hash(password)).pipe(
		Oath.ops.rejected_map(e => eio(`create -> error: ${e.message}`)),
	)

const _verify_password0 = (password: User.PrivateUser["password"]) => (user: User.PrivateUser) =>
	Oath.FromPromise(() => Bun.password.verify(password, user.password)).pipe(
		Oath.ops.rejected_map(() => enoent("validate_password -> passwords do not match")),
	)
