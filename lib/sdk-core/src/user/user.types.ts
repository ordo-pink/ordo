/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { GetDeviceInfo } from "@ordo-pink/get-device-info"

import type { Core } from "../core/core.types"
import type { CoreMixins } from "../mixins/mixins.types"
import type { SemVer } from "../semver/semver.types"
import type { Session } from "../session/session.types"
import type { USER } from "./user.constants"

export namespace User {
	/** User identifier. */
	export type ID = CoreMixins.Identifiable.ID

	/** User handle (the @ thing). */
	export type Handle = User.CustomMixins.Referable.Handle

	/** User email. */
	export type Email = User.CustomMixins.Receptive.Email

	/** Someone who uses Ordo. Represents a public user entity with limited fields. */
	export namespace Someone {
		export type DTO = [
			...CoreMixins.Identifiable.DTO,
			...CoreMixins.Timestampable.DTO<"without_updates">,
			...User.CustomMixins.Referable.DTO,
			...User.CustomMixins.Subscribed.DTO,
			...CoreMixins.Named.DTO,
		]

		export type Instance = Core.Prettify<Interface["Instance"]>

		export type Static = Core.Prettify<Interface["Static"]>

		// Extracted to prevent circular reference
		export type DataInterface = CoreMixins.Identifiable.Interface &
			CoreMixins.Timestampable.Interface<"without_updates"> &
			User.CustomMixins.Referable.Interface &
			User.CustomMixins.Subscribed.Interface &
			CoreMixins.Named.Interface

		export type Interface = User.Someone.DataInterface &
			CoreMixins.Serializable.Interface<User.Someone.DTO, User.Someone.DataInterface>
	}

	/** Current user. Represents the current authenticated user with a full field set. */
	export namespace Current {
		/** Arguments to be provided to the `new` static method to create a me user. */
		export type CreateParams = [
			/** Email is the only required field. */
			email: User.CustomMixins.Receptive.Email,
			/** Custom user handle. If not provided, it is created from the email and the id. */
			handle?: User.CustomMixins.Referable.Handle,
			/** User subscription level. Defaults to free subscription. */
			subscription?: User.CustomMixins.Subscribed.Subscription,
			/** User name. Defaults to empty string. */
			name?: CoreMixins.Named.Name,
			/** A set of pre-installed fns from the fn store. Defaults to empty array. */
			fns?: User.CustomMixins.UIExtendable.Fn[],
			/** Predefined max fns. */
			fn_limit?: User.CustomMixins.UIExtendable.FnLimit,
			/** Predefined max amount of files. */
			file_limit?: User.CustomMixins.SpaceLimited.FileLimit,
			/** Predefined max file size to be uploaded to the remote. */
			file_size_limit?: User.CustomMixins.SpaceLimited.FileSizeLimit,
		]

		export type DTO = [
			...User.Someone.DTO,
			...User.CustomMixins.Receptive.DTO,
			...User.CustomMixins.UIExtendable.DTO,
			...User.CustomMixins.SpaceLimited.DTO,
			...User.CustomMixins.Authenticated.DTO,
		]

		export type Instance = Core.Prettify<User.Current.Interface["Instance"]>

		export type Static = Core.Prettify<User.Current.Interface["Static"]>

		// Extracted to prevent circular reference
		export type DataInterface = User.Someone.DataInterface &
			User.CustomMixins.Receptive.Interface &
			User.CustomMixins.UIExtendable.Interface &
			User.CustomMixins.SpaceLimited.Interface &
			User.CustomMixins.Authenticated.Interface

		export type SerializableInterface = User.Current.DataInterface & CoreMixins.Serializable.Interface<DTO, DataInterface>

		export type Interface = SerializableInterface & CoreMixins.Creatable.Interface<CreateParams, DataInterface>
	}

	/** User-specific mixins. */
	export namespace CustomMixins {
		/** Authenticated mixin provides the behavior for handling user session state. */
		export namespace Authenticated {
			export type DTO = [sessions: Session.DTO[]]

			export type Interface = {
				Instance: {
					/** Get an array of session objects of the current user. */
					get_sessions: () => Session.Interface["Instance"][]
					/** Get an array of session DTOs. */
					get_sessions_raw: () => Session.DTO[]
				}
				Plain: { sessions: Session.Interface["Instance"][] }
				Static: CoreMixins.Identifiable.Interface["Static"] &
					CoreMixins.Timestampable.Interface<"without_updates">["Static"] & {
						/** Create a session DTO for given device info. */
						create_session: (device_info: GetDeviceInfo.DeviceInfo) => Session.DTO
						/** Default `sessions` value provider. */
						get_default_sessions: () => Session.DTO[]
					}
				Validations: CoreMixins.Identifiable.Interface["Validations"] &
					CoreMixins.Timestampable.Interface<"without_updates">["Validations"] & {
						/** Check if provided value is a valid session DTO. */
						is_session: (x: any) => x is Session.DTO
					}
			}
		}

		/** Receptive mixin provides the behavior for handling user email. */
		export namespace Receptive {
			export type Email = `${string}@${string}.${string}`

			export type DTO = [email: User.CustomMixins.Receptive.Email]

			export type Interface = {
				Instance: {
					/** Get email. What? */
					get_email: () => User.CustomMixins.Receptive.Email
				}
				Plain: { email: User.CustomMixins.Receptive.Email }
				Static: {}
				Validations: {
					/** Check if provided value is a valid email. */
					is_email: (x: any) => x is User.CustomMixins.Receptive.Email
				}
			}
		}

		/** Referrable mixin provides the behavior for handling user handle (the @ thing). */
		export namespace Referable {
			/** User handle, e.g. `@nagibator777`. */
			export type Handle = `@${string}` & {}

			export type DTO = [handle: User.CustomMixins.Referable.Handle]

			export type Interface = {
				Instance: {
					/** Get user handle. The handle includes the `@` sign at the beginning! */
					get_handle: () => User.CustomMixins.Referable.Handle
				}
				Plain: { handle: User.CustomMixins.Referable.Handle }
				Static: {
					/** Create handle from given email and id. It takes the email part before "@", the first chunk of the
					 * UUID, glues them together, and then trims off whatever exceeds the handle length limit. */
					create_handle: (email: Receptive.Email, id: User.ID) => User.CustomMixins.Referable.Handle
				}
				Validations: {
					/** Check if provided value is a valid handle. */
					is_handle: (x: any) => x is User.CustomMixins.Referable.Handle
				}
			}
		}

		export namespace SpaceLimited {
			export type FileLimit = number & {}
			export type FileSizeLimit = number & {}

			export type DTO = [
				file_limit: User.CustomMixins.SpaceLimited.FileLimit,
				file_size_limit: User.CustomMixins.SpaceLimited.FileSizeLimit,
			]

			export type Interface = {
				Instance: {
					can_create_file: (current_length: number) => boolean
					can_upload_file: (size: number) => boolean
					get_file_limit: () => User.CustomMixins.SpaceLimited.FileLimit
					get_file_size_limit: () => User.CustomMixins.SpaceLimited.FileSizeLimit
					get_files_left: (current_length: number) => number
				}
				Plain: {
					file_limit: User.CustomMixins.SpaceLimited.FileLimit
					file_size_limit: User.CustomMixins.SpaceLimited.FileSizeLimit
				}
				Static: {
					get_default_file_limit: () => User.CustomMixins.SpaceLimited.FileLimit
					get_default_file_size_limit: () => User.CustomMixins.SpaceLimited.FileSizeLimit
				}
				Validations: {
					is_file_limit: (x: any) => x is User.CustomMixins.SpaceLimited.FileLimit
					is_file_size_limit: (x: any) => x is User.CustomMixins.SpaceLimited.FileSizeLimit
				}
			}
		}

		export namespace Subscribed {
			export type Subscription = USER.SUBSCRIPTION

			export type DTO = [subscription: User.CustomMixins.Subscribed.Subscription]

			export type Interface = {
				Instance: {
					get_subscription: () => User.CustomMixins.Subscribed.Subscription
					has_paid_subscription: () => boolean
				}
				Plain: { subscription: User.CustomMixins.Subscribed.Subscription }
				Static: {
					SUBSCRIPTION: typeof USER.SUBSCRIPTION
					get_default_subscription: () => User.CustomMixins.Subscribed.Subscription
				}
				Validations: { is_subscription: (x: any) => x is User.CustomMixins.Subscribed.Subscription }
			}
		}

		export namespace UIExtendable {
			export type FnName = `@${string}/${string}`
			export type Fn = `${User.CustomMixins.UIExtendable.FnName}:${SemVer.Version}`
			export type FnLimit = number & {}

			export type DTO = [installed_fns: User.CustomMixins.UIExtendable.Fn[], fn_limit: User.CustomMixins.UIExtendable.FnLimit]

			export type Interface = {
				Instance: {
					can_install_fns: () => boolean
					get_fn_limit: () => User.CustomMixins.UIExtendable.FnLimit
					get_installed_fns_length: () => number
					get_installed_fns: () => User.CustomMixins.UIExtendable.Fn[]
					has_installed_fns: () => boolean
				}
				Plain: {
					installed_fns: User.CustomMixins.UIExtendable.Fn[]
					fn_limit: User.CustomMixins.UIExtendable.FnLimit
				}
				Static: {
					get_default_fn_limit: () => User.CustomMixins.UIExtendable.FnLimit
					get_default_fns: () => []
				}
				Validations: {
					is_fn: (x: any) => x is Fn
					is_fn_limit: (x: any) => x is User.CustomMixins.UIExtendable.FnLimit
					is_fn_name: (x: any) => x is User.CustomMixins.UIExtendable.FnName
					is_version: (x: any) => x is SemVer.Version
				}
			}
		}
	}
}
