/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import {
	is_array,
	is_finite_non_negative_int,
	is_int,
	is_non_empty_string,
	is_positive_number,
	is_string,
	is_uuid,
} from "@ordo-pink/tau"
import { sweech } from "@ordo-pink/sweech"

import type { Core } from "./core.types"
import type { User } from "./user.types"

export namespace user {
	export enum SUBSCRIPTION {
		FREE,
		PERSONAL,
		FAMILY,
		TEAM,
		ENTERPRISE,
		length,
	}

	export const DEFAULT_FILE_LIMIT = 1000

	export const DEFAULT_FN_LIMIT = 10

	export const DEFAULT_FILE_SIZE_LIMIT = 1.5

	export const DEFAULT_SUBSCRIPTION = SUBSCRIPTION.FREE

	export const other: User.Other.Static = {
		create_id: () => crypto.randomUUID(),
		create_timestamp: () => Date.now(),
		from_dto: dto => ({
			get_created_at: () => new Date(dto[1]),
			get_first_name: () => dto[4],
			get_full_name: () =>
				sweech
					.of_true()
					.case(!!dto[4] && !!dto[5], () => `${dto[4]} ${dto[5]}`)
					.case(!!dto[4], () => dto[4])
					.case(!!dto[5], () => dto[5])
					.default(() => ""),
			get_handle: () => dto[2],
			get_id: () => dto[0],
			get_last_name: () => dto[5],
			get_raw_created_at: () => dto[1],
			get_subscription: () => dto[3],
			has_paid_subscription: () => Number(dto[3]) > 0,
			is_created_after: (date, exclude) => (exclude ? dto[1] >= date.getMilliseconds() : dto[1] > date.getMilliseconds()),
			is_created_before: (date, exclude) => (exclude ? dto[1] <= date.getMilliseconds() : dto[1] < date.getMilliseconds()),
			to_dto: () => [...dto],
		}),
		validations: {
			is_dto: (x): x is User.Other.DTO =>
				is_array(x) &&
				user.other.validations.is_id(x[0]) &&
				user.other.validations.is_timestamp(x[1]) &&
				user.other.validations.is_handle(x[2]) &&
				user.other.validations.is_subscription(x[3]) &&
				user.other.validations.is_name(x[4]) &&
				user.other.validations.is_name(x[5]),
			is_handle: (x): x is User.Referrable.Handle =>
				is_string(x) && x[0] === "@" && x.length >= 2 && /^@[a-z0-9_]{1,23}$/.test(x),
			is_id: (x): x is Core.Model.Identifiable.ID => is_uuid(x),
			is_name: (x): x is User.Named.FirstName & User.Named.LastName => is_string(x),
			is_subscription: (x): x is SUBSCRIPTION => is_int(x) && x >= 0 && x < Number(SUBSCRIPTION.length),
			is_timestamp: (x): x is Core.Model.TimeTrackable.Timestamp => is_finite_non_negative_int(x),
		},
	}

	export const current: User.Current.Static = {
		...user.other,
		create: email => {
			const id = current.create_id()
			const created_at = current.create_timestamp()
			const handle = current.create_handle(email, id)

			return current.from_dto([
				id,
				created_at,
				handle,
				SUBSCRIPTION.FREE,
				"",
				"",
				email,
				[],
				DEFAULT_FILE_LIMIT,
				DEFAULT_FN_LIMIT,
				DEFAULT_FILE_SIZE_LIMIT,
				[],
			])
		},
		create_handle: (email, id) => {
			const first = email.split("@")[0]
			const last = id.split("-")[0]

			return `@${first}${last}` as const
		},
		from_dto: dto => ({
			...user.other.from_dto([dto[0], dto[1], dto[2], dto[3], dto[4], dto[5]]),
			can_create_file: length => length < dto[8],
			can_install_fns: () => dto[7].length < dto[9],
			can_upload_file: size => size <= dto[10],
			get_email: () => dto[6],
			get_session_device_info: id => dto[11].find(i => i[0] === id)?.[2] ?? null,
			get_file_limit: () => dto[8],
			get_file_size_limit: () => dto[10],
			get_files_left: length => dto[8] - length,
			get_fn_limit: () => dto[9],
			get_installed_fns: () => dto[7],
			get_sessions: () => dto[11],
			has_installed_fns: () => dto[7].length > 0,
			has_session: id => dto[11].some(i => i[0] === id),
			to_dto: () => [...dto],
			get installed_fns_length() {
				return dto[7].length
			},
			get sessions_length() {
				return dto[11].length
			},
		}),
		create_session: data_info => [current.create_id(), current.create_timestamp(), data_info],
		validations: {
			...user.other.validations,
			is_email: (x): x is User.Receptive.Email =>
				is_string(x) &&
				// eslint-disable-next-line no-useless-escape
				/^[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(
					x,
				),
			is_file_limit: (x): x is User.Limited.FileLimit => is_finite_non_negative_int(x),
			is_file_size_limit: (x): x is User.Limited.FileSizeLimit => is_positive_number(x),
			is_fn_limit: (x): x is User.Limited.FnLimit => is_finite_non_negative_int(x),
			// TODO More precise check for installable function
			is_installable_function: (x): x is User.UIExtendable.InstallableFunction => is_non_empty_string(x),
			is_session: (x): x is User.Authenticatable.Session =>
				// TODO More precise check for device info
				is_array(x) && current.validations.is_id(x[0]) && current.validations.is_timestamp(x[1]) && is_non_empty_string(x[2]),
			is_dto: (x): x is User.Current.DTO => {
				if (!user.other.validations.is_dto(x)) return false
				const y = x as unknown as User.Current.DTO
				return (
					user.current.validations.is_email(y[6]) &&
					user.current.validations.is_file_limit(y[8]) &&
					user.current.validations.is_file_size_limit(y[10]) &&
					user.current.validations.is_fn_limit(y[9]) &&
					is_array(y[7]) &&
					y[7].every(fn => user.current.validations.is_installable_function(fn)) &&
					is_array(y[11]) &&
					y[11].every(s => user.current.validations.is_session(s))
				)
			},
		},
	}
}
