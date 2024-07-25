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

import {
	type UUIDv4,
	from_option0,
	from_result0,
	is_bool,
	is_finite_non_negative_int,
	is_non_empty_string,
	is_positive_number,
	is_string,
	is_uuid,
	noop,
	override,
} from "@ordo-pink/tau"
import { O } from "@ordo-pink/option"
import { Oath } from "@ordo-pink/oath"
import { RRR } from "@ordo-pink/data"
import { okpwd } from "@ordo-pink/okpwd"

import { type TUserServiceStatic, type TUserValidations } from "./types"
import { Result } from "@ordo-pink/result"
import { Switch } from "@ordo-pink/switch"

const check_password = okpwd()

export const Validations: TUserValidations = {
	is_email: email =>
		Result.If(is_non_empty_string(email) && isEmail(email))
			.pipe(Result.ops.map(() => email as User.PrivateUser["email"]))
			.pipe(Result.ops.err_map(() => einval(`is_em email: ${String(email)}`))),

	is_id: id =>
		Result.If(is_uuid(id))
			.pipe(Result.ops.map(() => id as User.PrivateUser["id"]))
			.pipe(Result.ops.err_map(() => einval(`is_id: ${String(id)}`))),

	/**
	 * @todo Limit special chars (/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/ - after "@")
	 */
	is_handle: handle =>
		Result.If(is_non_empty_string(handle) && handle.startsWith("@") && handle.length > 1)
			.pipe(Result.ops.map(() => handle as User.PrivateUser["handle"]))
			.pipe(Result.ops.err_map(() => einval(`is_handle: ${String(handle)}`))),

	is_password: password =>
		Result.If(is_string(password), { F: () => "Password must be a string." })
			.pipe(Result.ops.map(() => check_password(password as string)))
			.pipe(Result.ops.chain(error => Result.If(!error, { F: () => error })))
			.pipe(Result.ops.map(() => password as User.PrivateUser["password"]))
			.pipe(Result.ops.err_map(error => einval(`is_password: ${error}`))),

	is_created_at: created_at =>
		Result.If(created_at instanceof Date)
			.pipe(Result.ops.map(() => created_at as User.PrivateUser["created_at"]))
			.pipe(Result.ops.err_map(() => einval(`is_created_at: ${String(created_at)}`))),

	is_email_code: email_code =>
		Result.If(is_non_empty_string(email_code))
			.pipe(Result.ops.map(() => email_code as User.PrivateUser["email_code"]))
			.pipe(Result.ops.err_map(() => einval(`is_email_code: ${String(email_code)}`))),

	is_email_confirmed: email_confirmed =>
		Result.If(is_bool(email_confirmed))
			.pipe(Result.ops.map(() => email_confirmed as User.PrivateUser["email_confirmed"]))
			.pipe(Result.ops.err_map(() => einval(`is_email_confirmed: ${String(email_confirmed)}`))),

	is_file_limit: file_limit =>
		Result.If(is_finite_non_negative_int(file_limit))
			.pipe(Result.ops.map(() => file_limit as User.PrivateUser["file_limit"]))
			.pipe(Result.ops.err_map(() => einval(`is_file_limit: ${String(file_limit)}`))),

	is_first_name: first_name =>
		Result.If(is_string(first_name))
			.pipe(Result.ops.map(() => first_name as User.PrivateUser["first_name"]))
			.pipe(Result.ops.err_map(() => einval(`is_first_name: ${String(first_name)}`))),

	is_last_name: last_name =>
		Result.If(is_string(last_name))
			.pipe(Result.ops.map(() => last_name as User.PrivateUser["last_name"]))
			.pipe(Result.ops.err_map(() => einval(`is_last_name: ${String(last_name)}`))),

	is_max_functions: max_functions =>
		Result.If(is_finite_non_negative_int(max_functions))
			.pipe(Result.ops.map(() => max_functions as User.PrivateUser["max_functions"]))
			.pipe(Result.ops.err_map(() => einval(`is_max_functions: ${String(max_functions)}`))),

	is_max_upload_size: max_upload_size =>
		Result.If(is_positive_number(max_upload_size))
			.pipe(Result.ops.map(() => max_upload_size as User.PrivateUser["max_upload_size"]))
			.pipe(Result.ops.err_map(() => einval(`is_max_upload_size: ${String(max_upload_size)}`))),

	is_subscription: subscription =>
		Result.If(is_non_empty_string(subscription))
			.pipe(Result.ops.map(() => subscription as User.PrivateUser["subscription"]))
			.pipe(Result.ops.err_map(() => einval(`is_subscription: ${String(subscription)}`))),

	is_entity_version: entity_version =>
		Result.If(is_finite_non_negative_int(entity_version))
			.pipe(Result.ops.map(() => entity_version as User.PrivateUser["entity_version"]))
			.pipe(Result.ops.err_map(() => einval(`is_entity_version: ${String(entity_version)}`))),
}

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

const migrate_0_to_1 = (user: User.UserV0): User.PrivateUser => ({
	created_at: user.createdAt,
	email: user.email as User.User["email"],
	email_code: user.code,
	email_confirmed: user.emailConfirmed,
	entity_version: 1,
	file_limit: user.fileLimit,
	first_name: user.firstName,
	handle: `@${user.id.split("-").join("")}`,
	id: user.id,
	last_name: user.lastName,
	max_functions: 5,
	max_upload_size: user.maxUploadSize,
	password: user.password,
	subscription: user.subscription,
})

export const UserService: TUserServiceStatic = {
	get ENTITY_VERSION() {
		return 1
	},

	Validations,

	serialise,
	serialise_internal,
	serialise_public,
	obfuscate_email,
	create_id,
	create_email_code,

	of: strategy => ({
		strategy,

		migrate: () =>
			strategy
				.migrate(UserService.ENTITY_VERSION)
				.pipe(Oath.ops.chain(() => strategy.get_outdated(UserService.ENTITY_VERSION)))
				.pipe(
					Oath.ops.map(users =>
						users.map(user =>
							Switch.Match(user.entity_version)
								.case(UserService.ENTITY_VERSION, () => user)
								.default(() => migrate_0_to_1(user as unknown as User.UserV0)),
						),
					),
				)
				.pipe(Oath.ops.chain(users => Oath.Merge(users.map(u => strategy.update(u.id, u)))))
				.pipe(Oath.ops.map(noop)),

		compare_password: (email, password) =>
			Oath.Merge({
				email: from_result0(UserService.Validations.is_email(email)),
				password: from_result0(UserService.Validations.is_password(password)),
			}).pipe(
				Oath.ops.chain(({ email, password }) =>
					strategy
						.get_by_email(email)
						.pipe(Oath.ops.chain(from_option0(() => enoent(`compare_password -> email: ${email}`))))
						.pipe(Oath.ops.chain(_verify_password0(password))),
				),
			),

		create: (email, handle, password) =>
			Oath.Merge({
				email: from_result0(UserService.Validations.is_email(email)),
				handle: from_result0(UserService.Validations.is_handle(handle)),
				password: from_result0(UserService.Validations.is_password(password)).pipe(
					Oath.ops.chain(_hash_password0),
				),
			})
				.pipe(
					Oath.ops.chain(params =>
						Oath.Merge([
							strategy
								.exists_by_email(params.email)
								.pipe(Oath.ops.chain(exists => Oath.If(!exists)))
								.pipe(Oath.ops.rejected_map(() => eexist(`create -> email: ${params.email}`))),
							strategy
								.exists_by_handle(params.handle)
								.pipe(Oath.ops.chain(exists => Oath.If(!exists)))
								.pipe(Oath.ops.rejected_map(() => eexist(`create -> handle: ${params.handle}`))),
						]).pipe(Oath.ops.map(() => params)),
					),
				)
				.pipe(
					Oath.ops.map(({ email, handle, password }) => ({
						email,
						handle,
						password,
						id: UserService.create_id(),
						email_confirmed: false,
						created_at: new Date(Date.now()),
						file_limit: 1000,
						max_upload_size: 1.5,
						subscription: "free",
						max_functions: 5,
						email_code: UserService.create_email_code(),
						first_name: "",
						last_name: "",
						entity_version: UserService.ENTITY_VERSION,
					})),
				)
				.pipe(Oath.ops.chain(user => strategy.create(user).pipe(Oath.ops.map(() => user))))
				.pipe(Oath.ops.map(UserService.serialise_internal)),

		get_by_email: email =>
			from_result0(UserService.Validations.is_email(email))
				.pipe(Oath.ops.chain(strategy.get_by_email))
				.pipe(Oath.ops.map(option => option.pipe(O.ops.map(UserService.serialise_internal)))),

		get_by_handle: handle =>
			from_result0(UserService.Validations.is_handle(handle))
				.pipe(Oath.ops.chain(strategy.get_by_handle))
				.pipe(Oath.ops.map(option => option.pipe(O.ops.map(UserService.serialise_internal)))),

		get_by_id: id =>
			from_result0(UserService.Validations.is_id(id))
				.pipe(Oath.ops.chain(strategy.get_by_id))
				.pipe(Oath.ops.map(option => option.pipe(O.ops.map(UserService.serialise_internal)))),

		update_email: (id, email) =>
			Oath.Merge({
				email: from_result0(UserService.Validations.is_email(email)),
				id: from_result0(UserService.Validations.is_id(id)),
			})
				.pipe(
					Oath.ops.chain(params =>
						strategy.exists_by_email(params.email).pipe(
							Oath.ops.chain(exists =>
								Oath.If(!exists)
									.pipe(Oath.ops.map(() => params))
									.pipe(Oath.ops.rejected_map(() => eexist(`update_email: ${email}`))),
							),
						),
					),
				)
				.pipe(
					Oath.ops.chain(({ id, email }) =>
						strategy
							.get_by_id(id)
							.pipe(Oath.ops.chain(from_option0(() => enoent(`update_email -> id: ${id}`))))
							.pipe(Oath.ops.map(override({ email })))
							.pipe(Oath.ops.map(override({ email_code: create_email_code() })))
							.pipe(Oath.ops.map(override({ email_confirmed: false })))
							.pipe(Oath.ops.chain(user => strategy.update(id, user)))
							.pipe(Oath.ops.map(user => user.email_code)),
					),
				),

		update_handle: (id, handle) =>
			Oath.Merge({
				id: from_result0(UserService.Validations.is_id(id)),
				handle: from_result0(UserService.Validations.is_handle(handle)),
			})
				.pipe(
					Oath.ops.chain(params =>
						strategy
							.exists_by_handle(params.handle)
							.pipe(Oath.ops.chain(exists => Oath.If(!exists)))
							.pipe(Oath.ops.map(() => params))
							.pipe(Oath.ops.rejected_map(() => eexist(`update_handle: ${params.handle}`))),
					),
				)
				.pipe(
					Oath.ops.chain(({ id, handle }) =>
						strategy
							.get_by_id(id)
							.pipe(Oath.ops.chain(from_option0(() => enoent(`update_handle -> id: ${id}`))))
							.pipe(Oath.ops.map(override({ handle })))
							.pipe(Oath.ops.chain(user => strategy.update(id, user)))
							.pipe(Oath.ops.map(noop)),
					),
				),

		update_info: (id, { first_name, last_name }) =>
			Oath.Merge({
				id: from_result0(UserService.Validations.is_id(id)),
				first_name: from_result0(UserService.Validations.is_first_name(first_name)),
				last_name: from_result0(UserService.Validations.is_last_name(last_name)),
			}).pipe(
				Oath.ops.chain(({ id, first_name, last_name }) =>
					strategy
						.get_by_id(id)
						.pipe(Oath.ops.chain(from_option0(() => enoent(`update_info -> id: ${id}`))))
						.pipe(Oath.ops.map(override({ first_name, last_name })))
						.pipe(Oath.ops.chain(user => strategy.update(id, user)))
						.pipe(Oath.ops.map(noop)),
				),
			),

		confirm_email: (id, code) =>
			Oath.Merge({
				id: from_result0(UserService.Validations.is_id(id)),
				code: from_result0(UserService.Validations.is_email_code(code)),
			}).pipe(
				Oath.ops.chain(({ id, code }) =>
					strategy
						.get_by_id(id)
						.pipe(Oath.ops.chain(from_option0(() => enoent(`confirm_email -> id: ${id}`))))
						.pipe(
							Oath.ops.chain(user =>
								Oath.If(user.email_code === code)
									.pipe(Oath.ops.map(() => user))
									.pipe(Oath.ops.rejected_map(() => einval(`confirm_email -> code: ${code}`))),
							),
						)
						.pipe(Oath.ops.map(override({ email_confirmed: true, email_code: "" })))
						.pipe(Oath.ops.chain(user => strategy.update(id, user)))
						.pipe(Oath.ops.map(noop)),
				),
			),

		update_password: (id, new_password) =>
			Oath.Merge({
				id: from_result0(UserService.Validations.is_id(id)),
				password: from_result0(UserService.Validations.is_password(new_password)),
			}).pipe(
				Oath.ops.chain(({ id, password }) =>
					strategy
						.get_by_id(id)
						.pipe(Oath.ops.chain(from_option0(() => enoent(`update_password -> id: ${id}`))))
						.pipe(
							Oath.ops.chain(user =>
								_hash_password0(password).pipe(Oath.ops.map(password => ({ ...user, password }))),
							),
						)
						.pipe(Oath.ops.chain(user => strategy.update(id, user)))
						.pipe(Oath.ops.map(noop)),
				),
			),

		update_subscription: (id, { file_limit, max_functions, max_upload_size, subscription }) =>
			Oath.Merge({
				id: from_result0(UserService.Validations.is_id(id)),
				file_limit: from_result0(UserService.Validations.is_file_limit(file_limit)),
				max_functions: from_result0(UserService.Validations.is_max_functions(max_functions)),
				max_upload_size: from_result0(UserService.Validations.is_max_upload_size(max_upload_size)),
				subscription: from_result0(UserService.Validations.is_subscription(subscription)),
			}).pipe(
				Oath.ops.chain(({ id, file_limit, max_functions, subscription }) =>
					strategy
						.get_by_id(id)
						.pipe(Oath.ops.chain(from_option0(() => enoent(`update_info -> id: ${id}`))))
						.pipe(
							Oath.ops.map(override({ file_limit, max_functions, max_upload_size, subscription })),
						)
						.pipe(Oath.ops.chain(user => strategy.update(id, user)))
						.pipe(Oath.ops.map(noop)),
				),
			),
	}),
}

// --- Internal ---

const LOCATION = "UserService"

const eio = RRR.codes.eio(LOCATION)
const enoent = RRR.codes.enoent(LOCATION)
const einval = RRR.codes.einval(LOCATION)
const eexist = RRR.codes.einval(LOCATION)

const _hash_password0 = (password: User.PrivateUser["password"]) =>
	Oath.FromPromise(() => Bun.password.hash(password)).pipe(
		Oath.ops.rejected_map(e => eio(`create -> error: ${e.message}`)),
	)

const _verify_password0 = (password: User.PrivateUser["password"]) => (user: User.PrivateUser) =>
	Oath.FromPromise(() => Bun.password.verify(password, user.password)).pipe(
		Oath.ops.rejected_map(() => enoent("validate_password -> passwords do not match")),
	)
