/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { CoreSDK } from "../core/core.types"
import type { CoreMixins } from "../mixins/mixins.types"
import type { Session } from "../session/session.types"
import { USER } from "./user.constants"
import type { User } from "./user.types"
import { core_sdk } from "../core/core.impl"
import { core_mixins } from "../mixins/mixins.impl"
import { sem_ver } from "../semver/semver.impl"
import { session } from "../session/session.impl"
import { user } from "./user.impl"

export namespace user_mixins {
	export const authenticated: CoreSDK.Mixin<User.CustomMixins.Authenticated.Interface> = {
		instance: ({ sessions }) => ({
			get_sessions: () => sessions,
			get_sessions_raw: () => sessions.map(session => session.to_dto()),
		}),
		static: {
			...core_mixins.identifiable.static,
			...core_mixins.timestampable.without_updates.static,
			create_session: data_info => [authenticated.static.create_id(), authenticated.static.create_timestamp(), data_info],
			get_default_sessions: () => [],
		},
		validations: {
			...core_mixins.identifiable.validations,
			...core_mixins.timestampable.without_updates.validations,
			is_session: (x): x is Session.DTO =>
				// TODO More precise check for device info
				core_sdk.validations.is_array(x) &&
				core_mixins.identifiable.validations.is_id(x[0]) &&
				core_mixins.timestampable.without_updates.validations.is_timestamp(x[1]) &&
				core_sdk.validations.is_string(x[2]),
		},
	}

	export namespace creatable {
		export const me: CoreSDK.Mixin<CoreMixins.Creatable.Interface<User.Current.CreateParams, User.Current.Interface>> = {
			instance: () => ({}),
			static: {
				new: (email, handle, subscription, name, fns, fn_limit, file_limit, file_size_limit) => {
					const id = user.current.create_id()
					const created_at = user.current.create_timestamp()
					const sessions = user.current.get_default_sessions()

					return user.current.from_dto(
						id,
						created_at,
						handle ?? user.current.create_handle(email, id),
						subscription ?? user.current.get_default_subscription(),
						name ?? user.current.get_default_name(),
						email,
						fns ?? user.current.get_default_fns(),
						file_limit ?? user.current.get_default_file_limit(),
						fn_limit ?? user.current.get_default_fn_limit(),
						file_size_limit ?? user.current.get_default_file_size_limit(),
						sessions,
					)
				},
			},
			validations: {},
		}
	}

	export const receptive: CoreSDK.Mixin<User.CustomMixins.Receptive.Interface> = {
		instance: ({ email }) => ({ get_email: () => email }),
		static: {},
		validations: {
			is_email: (x): x is User.CustomMixins.Receptive.Email => core_sdk.validations.is_string(x) && core_sdk.rx.email.test(x),
		},
	}

	export const referable: CoreSDK.Mixin<User.CustomMixins.Referable.Interface> = {
		instance: ({ handle }) => ({ get_handle: () => handle }),
		static: {
			create_handle: (email, id) => {
				const [first] = email.split("@", 1)
				const [last] = id.split("-", 1)
				const handle = `@${first}${last}`.slice(0, 23)

				return handle as User.CustomMixins.Referable.Handle
			},
		},
		validations: {
			is_handle: (x): x is User.CustomMixins.Referable.Handle =>
				core_sdk.validations.is_string(x) && core_sdk.rx.handle.test(x),
		},
	}

	export const space_limited: CoreSDK.Mixin<User.CustomMixins.SpaceLimited.Interface> = {
		instance: ({ file_limit, file_size_limit }) => ({
			can_create_file: length => length < file_limit,
			can_upload_file: size => size < file_size_limit,
			get_file_limit: () => file_limit,
			get_file_size_limit: () => file_size_limit,
			get_files_left: length => length - file_limit,
		}),
		static: {
			get_default_file_limit: () => 1000,
			get_default_file_size_limit: () => 1.5,
		},
		validations: {
			is_file_limit: core_sdk.validations.is_finite_non_negative_int,
			is_file_size_limit: core_sdk.validations.is_positive_number,
		},
	}

	export const subscribed: CoreSDK.Mixin<User.CustomMixins.Subscribed.Interface> = {
		instance: ({ subscription }) => ({
			get_subscription: () => subscription,
			has_paid_subscription: () => Number(subscription) > 0 && Number(subscription) < Number(USER.SUBSCRIPTION.length),
		}),
		static: { get_default_subscription: () => USER.SUBSCRIPTION.FREE, SUBSCRIPTION: USER.SUBSCRIPTION },
		validations: {
			is_subscription: (x): x is USER.SUBSCRIPTION =>
				core_sdk.validations.is_int(x) && x >= 0 && x < Number(USER.SUBSCRIPTION.length),
		},
	}

	export namespace serializable {
		export const someone: CoreSDK.Mixin<CoreMixins.Serializable.Interface<User.Someone.DTO, User.Someone.DataInterface>> = {
			instance: plain => ({
				to_dto: () => [plain.id, plain.created_at, plain.handle, plain.subscription, plain.name],
			}),
			static: {
				from_dto: (...dto) => {
					const plain: User.Someone.Interface["Plain"] = {
						created_at: dto[1],
						handle: dto[2],
						id: dto[0],
						name: dto[4],
						subscription: dto[3],
					}

					return {
						...core_mixins.identifiable.instance(plain),
						...core_mixins.named.instance(plain),
						...referable.instance(plain),
						...subscribed.instance(plain),
						...core_mixins.timestampable.without_updates.instance(plain),
						...serializable.someone.instance(plain),
					}
				},
			},
			validations: {
				is_dto: (x): x is User.Someone.DTO => {
					if (!core_sdk.validations.is_array(x)) return false

					const dto = x as User.Someone.DTO

					return (
						core_mixins.identifiable.validations.is_id(dto[0]) &&
						core_mixins.timestampable.without_updates.validations.is_timestamp(dto[1]) &&
						referable.validations.is_handle(dto[2]) &&
						subscribed.validations.is_subscription(dto[3]) &&
						core_mixins.named.validations.is_name(dto[4])
					)
				},
			},
		}

		export const me: CoreSDK.Mixin<CoreMixins.Serializable.Interface<User.Current.DTO, User.Current.DataInterface>> = {
			instance: plain => ({
				to_dto: () => [
					plain.id,
					plain.created_at,
					plain.handle,
					plain.subscription,
					plain.name,
					plain.email,
					plain.installed_fns,
					plain.fn_limit,
					plain.file_limit,
					plain.file_size_limit,
					plain.sessions.map(s => s.to_dto()),
				],
			}),
			static: {
				from_dto: (...dto) => {
					const plain: User.Current.Interface["Plain"] = {
						created_at: dto[1],
						email: dto[5],
						file_limit: dto[8],
						file_size_limit: dto[9],
						fn_limit: dto[7],
						handle: dto[2],
						id: dto[0],
						installed_fns: dto[6],
						name: dto[4],
						sessions: dto[10].map(s => session.from_dto(...s)),
						subscription: dto[3],
					}

					return {
						...core_mixins.identifiable.instance(plain),
						...core_mixins.named.instance(plain),
						...referable.instance(plain),
						...subscribed.instance(plain),
						...core_mixins.timestampable.without_updates.instance(plain),
						...receptive.instance(plain),
						...ui_extendable.instance(plain),
						...space_limited.instance(plain),
						...authenticated.instance(plain),
						...serializable.me.instance(plain),
					}
				},
			},
			validations: {
				is_dto: (x): x is User.Current.DTO => {
					if (!core_sdk.validations.is_array(x)) return false

					const dto = x as User.Current.DTO

					return (
						core_mixins.identifiable.validations.is_id(dto[0]) &&
						core_mixins.timestampable.without_updates.validations.is_timestamp(dto[1]) &&
						referable.validations.is_handle(dto[2]) &&
						subscribed.validations.is_subscription(dto[3]) &&
						core_mixins.named.validations.is_name(dto[4]) &&
						receptive.validations.is_email(dto[5]) &&
						dto[6].every(ui_extendable.validations.is_fn) &&
						ui_extendable.validations.is_fn_limit(dto[7]) &&
						space_limited.validations.is_file_limit(dto[8]) &&
						space_limited.validations.is_file_size_limit(dto[9]) &&
						dto[10].every(authenticated.validations.is_session)
					)
				},
			},
		}
	}

	export const ui_extendable: CoreSDK.Mixin<User.CustomMixins.UIExtendable.Interface> = {
		instance: ({ installed_fns, fn_limit }) => ({
			can_install_fns: () => installed_fns.length < fn_limit,
			get_fn_limit: () => fn_limit,
			get_installed_fns: () => [...installed_fns],
			get_installed_fns_length: () => installed_fns.length,
			has_installed_fns: () => installed_fns.length > 0,
		}),
		static: { get_default_fn_limit: () => 10, get_default_fns: () => [] },
		validations: {
			is_fn: (x): x is User.CustomMixins.UIExtendable.Fn => {
				if (!core_sdk.validations.is_string(x)) return false
				const parts = x.split(":")
				if (parts.length !== 2) return false
				return core_sdk.rx.fn_name.test(parts[0]) && sem_ver.is_sem_ver(parts[1])
			},
			is_fn_limit: core_sdk.validations.is_finite_non_negative_int,
			is_fn_name: (x): x is User.CustomMixins.UIExtendable.FnName =>
				core_sdk.validations.is_string(x) && core_sdk.rx.fn_name.test(x),
			is_version: sem_ver.is_sem_ver,
		},
	}
}
