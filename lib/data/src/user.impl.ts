import isEmail from "validator/lib/isEmail" // TODO: Drop dependency

import * as tau from "@ordo-pink/tau"
import { Switch } from "@ordo-pink/switch"

import type * as Types from "./user.types"

const is_email = (x: unknown): x is Types.TEmail => tau.is_non_empty_string(x) && isEmail(x)

const is_handle = (x: unknown): x is Types.TUserHandle =>
	tau.is_non_empty_string(x) && x.startsWith("@") && /^[A-Za-z0-9_-]+$/.test(x.slice(1))

export const PublicUserValidations: Types.TPublicUserValidations = {
	is_created_at: x => tau.is_date(x),
	is_handle: x => is_handle(x),
	is_subscription: x => tau.is_non_empty_string(x),
}

export const UserValidations: Types.TUserValidations = {
	is_created_at: x => tau.is_date(x),
	is_email: x => is_email(x),
	is_email_confirmed: x => tau.is_bool(x),
	is_file_limit: x => tau.is_finite_non_negative_int(x),
	is_first_name: x => tau.is_string(x),
	is_handle: x => is_handle(x),
	is_id: x => tau.is_uuid(x),
	is_last_name: x => tau.is_string(x),
	is_max_functions: x => tau.is_finite_non_negative_int(x),
	is_max_upload_size: x => tau.is_positive_number(x),
	is_subscription: x => tau.is_non_empty_string(x),
}

export const PublicUser: Types.TPublicUserStatic = {
	Validations: PublicUserValidations,
	FromDTO: dto => ({
		get_created_at: () => dto.created_at,
		get_handle: () => dto.handle,
		get_subscription: () => dto.subscription,
	}),
}

export const User: Types.TUserStatic = {
	Validations: UserValidations,
	FromDTO: dto => ({
		get_email: () => dto.email,
		get_created_at: () => dto.created_at,
		get_file_limit: () => dto.file_limit,
		get_first_name: () => dto.first_name,
		get_full_name: () =>
			Switch.Match(dto)
				.case(
					u => !!u.first_name && !!u.last_name,
					u => `${u.first_name} ${u.last_name}`,
				)
				.case(
					u => !!u.first_name,
					u => u.first_name,
				)
				.case(
					u => !!u.last_name,
					u => u.last_name,
				)
				.default(u => u.handle),
		get_handle: () => dto.handle,
		get_id: () => dto.id,
		get_last_name: () => dto.last_name,
		get_max_functions: () => dto.max_functions,
		get_max_upload_size: () => dto.max_upload_size,
		get_subscription: () => dto.subscription,
		is_email_confirmed: () => dto.email_confirmed,
	}),
}
