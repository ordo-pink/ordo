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

import type { ComponentType, MouseEvent } from "react"
import type { IconType } from "react-icons"
import type { Observable } from "rxjs"

import type {
	FSID,
	PlainData,
	TCreateMetadataParams,
	TMetadataDTO,
	TMetadataQuery,
	TRrr,
	TUserQuery,
} from "@ordo-pink/data"
import type { ISO_639_1_Locale, TwoLetterLocale } from "@ordo-pink/locale"
import type { JTI, SUB } from "@ordo-pink/wjwt"
import type { TLogger } from "@ordo-pink/logger"
import type { TOption } from "@ordo-pink/option"
import type { TResult } from "@ordo-pink/result"
import type { UUIDv4 } from "@ordo-pink/tau"

import type { BackgroundTaskStatus } from "./constants"

export type TQueryPermission =
	| "application.title"
	| "application.sidebar"
	| "application.fetch"
	| "application.hosts"
	| "application.logger"
	| "application.commands"
	| "application.current_fid"
	| "application.current_language"
	| "application.current_route"
	| "application.current_activity"
	| "application.current_file_association"
	| "users.current_user.achievements"
	| "users.current_user.is_authenticated"
	| "users.current_user.public_info" // User.PublicUser
	| "users.current_user.internal_info" // User.User
	| "users.users_query"
	| "functions.activities"
	| "functions.file_associations"
	| "functions.editor_plugins"
	| "functions.persisted_state"
	| "data.metadata_query"
	| "data.content_query"

// TODO: Add support for command intellisense
export type TCommandPermission = Client.Commands.CommandName

export type TPermissions = {
	queries: TQueryPermission[]
	commands: TCommandPermission[]
}

export type TFetch = typeof window.fetch

export type THosts = { id: string; dt: string; static: string; website: string; my: string }

// TODO: Move away all internal types

export type TFIDAwareActivity = Functions.Activity & { fid: symbol }

export type TRequireFID<$TReturn> = (fid: symbol | null) => $TReturn

export type TGetCurrentRouteFn = TRequireFID<
	() => TResult<Observable<TOption<Client.Router.Route>>, TRrr<"EPERM">>
>

export type TWorkspaceSplitSize = [number, number]

export type TDisabledSidebar = { disabled: true }

export type TEnabledSidebar = { disabled: false; sizes: TWorkspaceSplitSize }

export type TSidebarState = TEnabledSidebar | TDisabledSidebar

export type TGetSidebarFn = TRequireFID<() => TResult<Observable<TSidebarState>, TRrr<"EPERM">>>

export type TTitleState = { window_title: string; status_bar_title?: string }
export type TGetTitleFn = TRequireFID<() => TResult<Observable<TTitleState>, TRrr<"EPERM">>>
export type TGetHostsFn = TRequireFID<() => TResult<THosts, TRrr<"EPERM">>>
export type TGetFetchFn = TRequireFID<() => TFetch>
export type TGetLoggerFn = TRequireFID<() => TLogger>
export type TGetCommandsFn = TRequireFID<() => Client.Commands.Commands>
export type TGetIsAuthenticatedFn = TRequireFID<() => TResult<Observable<boolean>, TRrr<"EPERM">>>
export type TGetMetadataQueryFn = TRequireFID<() => TResult<TMetadataQuery, TRrr<"EPERM">>>
export type TGetUserQueryFn = TRequireFID<() => TResult<TUserQuery, TRrr<"EPERM">>>
// export type TGetContentQueryFn = TRequireFID<() => TResult<TContentQuery, TRrr<"EPERM">>>

export type TTranslations = Record<TwoLetterLocale, Record<string, string>>

export type TGetTranslationsFn = () => Observable<TOption<TTranslations>>
export type TSetCurrentActivityFn = TRequireFID<
	(name: string) => TResult<void, TRrr<"EPERM" | "ENOENT">>
>
export type TGetCurrentActivityFn = TRequireFID<
	() => TResult<Observable<TOption<Functions.Activity>>, TRrr<"EPERM" | "ENOENT">>
>
export type TTranslateFn = {
	$: Observable<number>
	(key: keyof TFlatTranslations, default_value?: string): string
}
export type TGetCurrentLanguageFn = TRequireFID<
	() => TResult<Observable<TwoLetterLocale>, TRrr<"EPERM">>
>

export type TKnownFunctions = {
	validate: (fid: symbol | null) => boolean
	exchange: (fid: symbol | null) => TOption<string>
	is_internal: (fid: symbol | null) => boolean
	has_permissions: (fid: symbol | null, permissions: Partial<TPermissions>) => boolean
	register: (name: string | null, permissions: TPermissions) => symbol | null
	unregister: (name: string | null) => boolean
}

export type TCreateFunctionInternalContext = {
	is_dev: boolean
	get_commands: TGetCommandsFn
	get_logger: TGetLoggerFn
	get_current_route: TGetCurrentRouteFn
	get_sidebar: TGetSidebarFn
	get_hosts: TGetHostsFn
	get_is_authenticated: TGetIsAuthenticatedFn
	get_fetch: TGetFetchFn
	get_translations: TGetTranslationsFn
	translate: TTranslateFn
	get_current_language: TGetCurrentLanguageFn
	get_metadata_query: TGetMetadataQueryFn
	get_user_query: TGetUserQueryFn
	// get_content_query: TGetContentQueryFn
	known_functions: TKnownFunctions
}

export type TCreateFunctionContext = {
	fid: symbol
	is_dev: boolean
	get_commands: ReturnType<TGetCommandsFn>
	get_sidebar: ReturnType<TGetSidebarFn>
	get_logger: ReturnType<TGetLoggerFn>
	get_current_route: ReturnType<TGetCurrentRouteFn>
	get_hosts: ReturnType<TGetHostsFn>
	get_is_authenticated: ReturnType<TGetIsAuthenticatedFn>
	get_fetch: ReturnType<TGetFetchFn>
	get_translations: TGetTranslationsFn
	translate: TTranslateFn
	get_current_language: ReturnType<TGetCurrentLanguageFn>
	get_metadata_query: ReturnType<TGetMetadataQueryFn>
	get_user_query: ReturnType<TGetUserQueryFn>
	// get_content_query: TGetContentQueryFn
}

export type TCreateFunctionFn = (
	name: string,
	permissions: TPermissions,
	callback: (context: TCreateFunctionContext) => void | Promise<void>,
) => (params: TCreateFunctionInternalContext) => void | Promise<void>

export type TOrdoContext = TCreateFunctionContext

declare global {
	module Routes {
		type TSuccessResponse<T> = { success: true; result: T }
		type TErrorResponse = { success: false; error: string }
		type TTokenResult = {
			sub: SUB
			jti: JTI
			expires: Date
			token: string
			file_limit: User.User["file_limit"]
			subscription: User.User["subscription"]
			max_upload_size: User.User["max_upload_size"]
			max_functions: User.User["max_functions"]
		}

		module DT {
			module SyncMetadata {
				type Path = `/${User.User["id"]}`
				type Method = "POST"
				type Cookies = void
				type Params = void
				type RequestBody = TMetadataDTO[] // TODO: Replace with array of atomic changes
				type StatusCode = 200
				type ResponseBody = string
			}

			module GetContent {
				type Path = `/${User.User["id"]}/${TMetadataDTO["fsid"]}`
				type Method = "GET"
				type Cookies = void
				type Params = { user_id?: string; fsid?: string }
				type RequestBody = void
				type StatusCode = 200
				type ResponseBody = string | ArrayBuffer
			}

			module SetContent {
				type Path = `/${User.User["id"]}/${TMetadataDTO["fsid"]}/${TMetadataDTO["type"]}`
				type Method = "PUT"
				type Cookies = void
				type Params = { user_id?: string; fsid?: string }
				type RequestBody = string | ArrayBuffer
				type StatusCode = 204
				type ResponseBody = void
			}

			module CreateContent {
				type Path = `/${User.User["id"]}`
				type Url =
					`${string}${Path}?name=${string}&parent=${TMetadataDTO["parent"]}&content_type=${TMetadataDTO["type"]}`
				type Method = "POST"
				type Cookies = void
				type Params = { user_id?: string; name?: string; parent?: string }
				type RequestBody = string | ArrayBuffer
				type StatusCode = 201
				type ResponseBody = void
			}
		}

		module ID {
			module UpdateInfo {
				type Path = "/account/info"
				type Method = "PATCH"
				type Cookies = void
				type Params = void
				type RequestBody = { first_name?: string; last_name?: string }
				type StatusCode = 200
				type ResponseBody = User.User

				type Request = {
					path: Path
					method: Method
					cookies: Cookies
					params: Params
					body: RequestBody
				}
				type Response = { status: StatusCode; body: ResponseBody }
			}

			module UpdateEmail {
				type Path = "/account/email"
				type Method = "PATCH"
				type Cookies = void
				type Params = void
				type StatusCode = 200
				type RequestBody = { email?: string }
				type ResponseBody = User.User

				type Request = {
					path: Path
					method: Method
					cookies: Cookies
					params: Params
					body: RequestBody
				}
				type Response = { status: StatusCode; body: ResponseBody }
			}

			module UpdateHandle {
				type Path = "/account/handle"
				type Method = "PATCH"
				type Cookies = void
				type Params = void
				type StatusCode = 200
				type RequestBody = { handle?: string }
				type ResponseBody = User.User

				type Request = {
					path: Path
					method: Method
					cookies: Cookies
					params: Params
					body: RequestBody
				}
				type Response = { status: StatusCode; body: ResponseBody }
			}

			module UpdatePassword {
				type Path = "/account/password"
				type Method = "PATCH"
				type Cookies = void
				type Params = void
				type StatusCode = 200
				type RequestBody = { old_password?: string; new_password?: string }
				type ResponseBody = TTokenResult

				type Request = {
					path: Path
					method: Method
					cookies: Cookies
					params: Params
					body: RequestBody
				}
				type Response = { status: StatusCode; body: ResponseBody }
			}

			module ConfirmEmail {
				type Path = "/account/confirm-email"
				type Url = `${string}${Path}?email=${string}&code=${string}` // TODO: Define host
				type Method = "POST"
				type Cookies = void
				type Params = void
				type StatusCode = 200
				type RequestBody = { email?: string; code?: string }
				type ResponseBody = User.User

				type Request = {
					path: Path
					method: Method
					cookies: Cookies
					params: Params
					body: RequestBody
				}
				type Response = { status: StatusCode; body: ResponseBody }
			}

			module GetAccount {
				type Path = "/account"
				type Method = "GET"
				type Cookies = void
				type Params = void
				type RequestBody = void
				type StatusCode = 200
				type ResponseBody = User.User

				type Request = {
					path: Path
					method: Method
					cookies: Cookies
					params: Params
					body: RequestBody
				}
				type Response = { status: StatusCode; body: ResponseBody }
			}

			module GetUserByEmail {
				type Path = `/users/email/${string}`
				type Method = "GET"
				type Cookies = void
				type Params = { email?: string }
				type RequestBody = void
				type StatusCode = 200
				type ResponseBody = User.PublicUser

				type Request = {
					path: Path
					method: Method
					cookies: Cookies
					params: Params
					body: RequestBody
				}
				type Response = { status: StatusCode; body: ResponseBody }
			}

			module GetUserByHandle {
				type Path = `/users/handle/${string}`
				type Method = "GET"
				type Cookies = void
				type Params = { handle?: string }
				type RequestBody = void
				type StatusCode = 200
				type ResponseBody = User.PublicUser

				type Request = {
					path: Path
					method: Method
					cookies: Cookies
					params: Params
					body: RequestBody
				}
				type Response = { status: StatusCode; body: ResponseBody }
			}

			module GetUserByID {
				type Path = `/users/id/${string}`
				type Method = "GET"
				type Cookies = void
				type Params = { id?: string }
				type RequestBody = void
				type StatusCode = 200
				type ResponseBody = User.PublicUser

				type Request = {
					path: Path
					method: Method
					cookies: Cookies
					params: Params
					body: RequestBody
				}
				type Response = { status: StatusCode; body: ResponseBody }
			}

			module RefreshToken {
				type Path = "/account/refresh-token"
				type Method = "POST"
				type Cookies = { sub?: string; jti?: string }
				type Params = void
				type RequestBody = void
				type StatusCode = 200
				type ResponseBody = TTokenResult

				type Request = {
					path: Path
					method: Method
					cookies: Cookies
					params: Params
					body: RequestBody
				}
				type Response = { status: StatusCode; body: ResponseBody }
			}

			module SignIn {
				type Path = "/account/sign-in"
				type Method = "POST"
				type Cookies = void
				type Params = void
				type StatusCode = 200
				type RequestBody = { email?: string; handle?: string; password?: string }
				type ResponseBody = TTokenResult

				type Request = {
					path: Path
					method: Method
					cookies: Cookies
					params: Params
					body: RequestBody
				}
				type Response = { status: StatusCode; body: ResponseBody }
			}

			module SignUp {
				type Path = "/account/sign-up"
				type Method = "POST"
				type Cookies = void
				type Params = void
				type RequestBody = { email?: string; handle?: string; password?: string }
				type StatusCode = 201
				type ResponseBody = TTokenResult

				type Request = {
					path: Path
					method: Method
					cookies: Cookies
					params: Params
					body: RequestBody
				}
				type Response = { status: StatusCode; body: ResponseBody }
			}

			module SignOut {
				type Path = "/account/sign-out"
				type Method = "POST"
				type Cookies = { sub?: SUB; jti?: JTI }
				type Params = void
				type RequestBody = void
				type StatusCode = 204
				type ResponseBody = void

				type Request = {
					path: Path
					method: Method
					cookies: Cookies
					params: Params
					body: RequestBody
				}
				type Response = { status: StatusCode }
			}

			module VerifyToken {
				type Path = "/account/verify-token"
				type Method = "POST"
				type Cookies = void
				type Params = void
				type RequestBody = void
				type StatusCode = 200
				type ResponseBody = void

				type Request = {
					path: Path
					method: Method
					cookies: Cookies
					params: Params
					body: RequestBody
				}
				type Response = { status: StatusCode }
			}
		}
	}

	// TODO: Remove
	type PropsWithChildren<T extends Record<string, unknown> = Record<string, unknown>> = T & {
		children?: any
	}

	module Achievements {
		type AchievementSubscriber = (actions: {
			update: (callback: (previousState: AchievementDAO) => AchievementDAO) => void
			grant: () => void
		}) => void

		type AchievementCategory = "collection" | "challenge" | "legacy" | "education"

		type AchievementDAO = {
			id: string
			title: string
			image: string
			description: string
			previous?: string
			completedAt?: Date | null
			category: AchievementCategory
		}

		type Achievement = {
			descriptor: AchievementDAO
			subscribe: AchievementSubscriber
		}
	}

	type TRecordToKVUnion<
		$TRecord extends object,
		$TPrefix extends string = "root",
		$TKey extends keyof $TRecord = keyof $TRecord,
	> = $TKey extends string
		? $TRecord[$TKey] extends () => infer V
			? { key: `${$TPrefix}.${$TKey}`; value: V }
			: $TRecord[$TKey] extends object
				? TRecordToKVUnion<$TRecord[$TKey], `${$TPrefix}.${$TKey}`, keyof $TRecord[$TKey]>
				: never
		: null

	type TFlattenRecord<T extends { key: string; value: any }> = {
		[K in T["key"]]: Extract<T, { key: K }>["value"]
	}

	type TFlatCommands = TFlattenRecord<TRecordToKVUnion<cmd, "cmd">>
	type TFlatTranslations = TFlattenRecord<TRecordToKVUnion<t, "t">>
	type TCommand = keyof TFlatCommands
	type TTranslationKey = keyof TFlatTranslations

	interface t {
		common: {
			urls: {
				twitter_x: () => string
				support_email: () => string
				support_messenger: () => string
				contact_us: () => string
			}
			components: {
				command_palette: {
					search_placeholder: () => string
					hide: () => string
					exit_key_hint: () => string
				}
				sidebar: {
					toggle: () => string
					hide: () => string
					show: () => string
				}
			}
		}
	}

	type TDropPrefix<
		$TStr extends string,
		$TPrefix extends string,
	> = $TStr extends `${$TPrefix}.${infer $TRest}` ? $TRest : never

	type TScopedTranslations<$TScope extends string> = Record<
		TDropPrefix<keyof TFlatTranslations, `t.${$TScope}`>,
		string
	>

	interface cmd {
		application: {
			set_title: () => { window_title: string; status_bar_title?: string }
			add_translations: <$TPrefix extends string>() => {
				lang: ISO_639_1_Locale
				prefix: $TPrefix
				translations: Partial<TScopedTranslations<$TPrefix>>
			}
			background_task: {
				set_status: () => BackgroundTaskStatus
				start_saving: () => void
				start_loading: () => void
				reset_status: () => void
			}
			notification: {
				show: () => Client.Notification.ShowNotificationParams
				hide: () => string
			}
			context_menu: {
				add: () => Client.CtxMenu.Item
				remove: () => string
				show: () => Client.CtxMenu.ShowOptions
				hide: () => void
			}
			command_palette: {
				add: () => Client.CommandPalette.Item
				remove: () => string
				show: () => {
					items: Client.CommandPalette.Item[]
					on_new_item?: (new_item: string) => unknown
					multiple?: boolean
					pinned_items?: Client.CommandPalette.Item[]
				}
				hide: () => void
			}
			sidebar: {
				enable: () => void
				disable: () => void
				set_size: () => [number, number]
				show: () => [number, number] | undefined
				hide: () => void
				toggle: () => void
			}
			router: {
				navigate: () => Client.Router.NavigateParams | string
				open_external: () => Client.Router.OpenExternalParams
			}
			modal: {
				show: () => Client.Modal.ModalPayload
				hide: () => void
			}
		}
		functions: {
			activities: {
				register: () => { fid: symbol; activity: Functions.Activity }
				unregister: () => { fid: symbol; name: Functions.Activity["name"] }
			}
			persisted_state: {
				update: () => { key: string; value: any }
			}
			file_associations: {
				add: () => Functions.FileAssociation
				remove: () => Functions.FileAssociation["name"]
			}
		}
		user: {
			achievement: {
				add: () => Achievements.Achievement
			}
		}
		data: {
			metadata: {
				show_upload_modal: () => FSID | null
				show_create_modal: () => FSID | null
				show_remove_modal: () => FSID
				show_rename_modal: () => FSID
				show_edit_labels_palette: () => FSID
				show_edit_links_palette: () => FSID
				create: () => TCreateMetadataParams
				remove: () => FSID
				rename: () => { fsid: FSID; new_name: string }
				move: () => { fsid: FSID; new_parent: FSID | null }
				add_labels: () => { fsid: FSID; labels: string[] }
				remove_labels: () => { fsid: FSID; labels: string[] }
				add_links: () => { fsid: FSID; links: FSID[] }
				remove_links: () => { fsid: FSID; links: FSID[] }
			}
			content: {
				get: () => FSID
				set: () => { fsid: FSID; content: string | ArrayBuffer; content_type: string }
				upload: () => {
					name: string
					parent: FSID | null
					content: string | ArrayBuffer
					content_type: string
				}
				drop: () => FSID
			}
		}
	}

	module Functions {
		type Activity = {
			name: string
			routes: string[]
			default_route?: string
			render_workspace?: (div: HTMLDivElement) => void
			render_sidebar?: (div: HTMLDivElement) => void
			render_icon?: (div: HTMLSpanElement) => void
			on_unmount?: (params: { workspace: HTMLDivElement; sidebar: HTMLDivElement }) => void
			is_background?: boolean
			is_fullscreen?: boolean
		}

		type FileExtension = `.${string}`

		type FileAssociationComponentProps = {
			is_loading: boolean
			is_editable: boolean
			is_embedded: boolean
			content: string | ArrayBuffer | null
			data: PlainData
		}

		type FileAssociation = {
			name: string
			content_type: string
			Icon?: ComponentType
			Component: ComponentType<FileAssociationComponentProps>
		}
	}

	module User {
		export type PublicUser = {
			email: `${string}@${string}`
			created_at: Date
			subscription: string
			handle: `@${string}`
			first_name: string
			last_name: string
		}

		export type User = User.PublicUser & {
			id: UUIDv4
			email_confirmed: boolean
			file_limit: number
			max_upload_size: number
			max_functions: number
		}

		export type InternalUser = User.User & {
			email_code: string
		}

		export type PrivateUser = User.InternalUser & {
			password: string
			entity_version: number
		}

		export type UserV0 = {
			email: string
			createdAt: Date
			subscription: string
			firstName: string
			lastName: string
			id: UUIDv4
			emailConfirmed: boolean
			fileLimit: number
			maxUploadSize: number
			code: string
			password: string
		}
	}

	module Client {
		module Commands {
			type CommandName = keyof TFlatCommands

			/**
			 * Command without payload.
			 */
			export type Command<N extends CommandName = CommandName> = { name: N; key?: string }

			/**
			 * Command with payload.
			 */
			export type PayloadCommand<N extends CommandName = CommandName, P = any> = Command<N> & {
				payload: P
			}

			/**
			 * Command handler.
			 */
			export type TCommandHandler<P> = (payload: P) => unknown

			export type Commands = {
				/**
				 * Append a listener to a given command.
				 */
				on: <$TKey extends keyof TFlatCommands>(
					name: $TKey,
					handler: TCommandHandler<TFlatCommands[$TKey]>,
				) => void

				/**
				 * Prepend listener to a given command.
				 */
				before: <$TKey extends keyof TFlatCommands>(
					name: $TKey,
					handler: TCommandHandler<TFlatCommands[$TKey]>,
				) => void

				/**
				 * Append a listener to a given command.
				 */
				after: <$TKey extends keyof TFlatCommands>(
					name: $TKey,
					handler: TCommandHandler<TFlatCommands[$TKey]>,
				) => void

				/**
				 * Remove given listener for a given command. Make sure you provide a reference to the same
				 * function as you did when calling `on`.
				 */
				off: <$TKey extends keyof TFlatCommands>(
					name: $TKey,
					handler: TCommandHandler<TFlatCommands[$TKey]>,
				) => void

				/**
				 * Emit given command with given payload. You can provide an optional key that you can use
				 * later to apply targeted cancellation for the command. Emission does not happen if there
				 * is a command with given key already.
				 */
				emit: <$TKey extends keyof TFlatCommands>(
					name: $TKey,
					...rest: TFlatCommands[$TKey] extends void
						? [key?: string]
						: [payload: TFlatCommands[$TKey], key?: string]
				) => void

				/**
				 * Cancel a command with given payload. If you provided a key when emitting the command,
				 * you can provide it for targeted cancellation.
				 */
				cancel: <$TKey extends keyof TFlatCommands>(
					name: $TKey,
					payload?: TFlatCommands[$TKey],
					key?: string,
				) => void
			}
		}

		module Router {
			/**
			 * Route descriptor to be passed for navigating.
			 */
			export type RouteConfig = {
				route: string
				queryString?: string | Record<string, string>
				pageTitle?: string
				data?: Record<string, unknown>
				preserveQuery?: boolean
				replace?: boolean
				exec?: boolean
			}

			export type NavigateParams = [
				routeConfig: string | RouteConfig,
				replace?: boolean,
				exec?: boolean,
			]

			export type OpenExternalParams = { url: string; new_tab?: boolean }

			export type Route<
				Params extends Record<string, string | undefined> = Record<string, string | undefined>,
				Data = null,
			> = {
				params?: Params
				data: Data
				hash: string
				hashRouting: boolean
				search: string
				path: string
				route: string
			}
		}

		module Notification {
			type Type = "success" | "rrr" | "info" | "warn" | "question" | "default"

			type Item = Notification.ShowNotificationParams & { id: string }

			type ShowNotificationParams = {
				id?: string
				type?: Type
				title?: string
				message: string
				icon?: string
				duration?: number
				on_click?: () => void
				// persist?: boolean
				// payload?: T
				// action?: (id: string, payload: T) => unknown
				// actionText?: string
			}
		}

		module Modal {
			export type ModalPayload = {
				show_close_button?: boolean
				on_unmount?: () => void
				render: (div: HTMLDivElement) => void
			}
		}

		module CtxMenu {
			/**
			 * Context menu item.
			 */
			export type Item<T = unknown> = {
				/**
				 * Check whether the item needs to be shown.
				 */
				should_show: ItemMethod<T, boolean>

				/**
				 * @see ItemType
				 */
				type: ItemType

				/**
				 * Name of the command to be invoked when the context menu item is used.
				 */
				cmd: Client.Commands.CommandName

				/**
				 * Readable name of the context menu item. Put a translated value here.
				 */
				readable_name: string

				/**
				 * Icon to be displayed for the context menu item.
				 */
				Icon: IconType

				/**
				 * Keyboard accelerator for the context menu item. It only works while the context menu is
				 * opened.
				 *
				 * @optional
				 */
				accelerator?: string

				/**
				 * Check whether the item needs to be shown disabled.
				 *
				 * @optional
				 * @default () => false
				 */
				should_be_disabled?: ItemMethod<T, boolean>

				/**
				 * This function allows you to override the incoming payload that will be passed to the command
				 * invoked by the context menu item.
				 *
				 * @optional
				 * @default () => payload
				 */
				payload_creator?: ItemMethod<T>
			}

			/**
			 * Show context menu item parameters.
			 */
			export type ShowOptions<T = PlainData | string> = {
				/**
				 * Accepted mouse event.
				 */
				event: MouseEvent

				/**
				 * Payload to be passed to the context menu item methods.
				 * @optional
				 */
				payload?: T

				/**
				 * Avoid showing create items.
				 * @optional
				 * @default false
				 */
				hide_create_items?: boolean

				/**
				 * Avoid showing read items.
				 * @optional
				 * @default false
				 */
				hide_read_items?: boolean

				/**
				 * Avoid showing update items.
				 * @optional
				 * @default false
				 */
				hide_update_items?: boolean

				/**
				 * Avoid showing delete items.
				 * @optional
				 * @default false
				 */
				hide_delete_items?: boolean
			}

			/**
			 * Context menu item method parameters.
			 */
			export type ItemMethodParams<T = any> = { event: MouseEvent; payload?: T }

			/**
			 * Context menu item method descriptor.
			 */
			export type ItemMethod<T = any, Result = any> = (params: ItemMethodParams<T>) => Result

			/**
			 * Context menu item type. This impacts two things:
			 *
			 * 1. Grouping items in the context menu.
			 * 2. Given type can be hidden when showing context menu.
			 */
			export type ItemType = "create" | "read" | "update" | "delete"

			/**
			 * Context menu.
			 */
			export type ContextMenu = ShowOptions & {
				/**
				 * Items to be shown in the context menu.
				 */
				structure: Item[]
			}
		}

		module CommandPalette {
			/**
			 * Command palette item.
			 */
			export type Item = {
				/**
				 * ID of the command to be invoked when the command palette item is used.
				 */
				id: string

				/**
				 * Readable name of the command palette item. Put a translation key here, if you use i18n.
				 */
				readable_name: keyof TFlatTranslations

				/**
				 * Action to be executed when command palette item is used.
				 */
				on_select: () => void

				/**
				 * Icon to be displayed for the context menu item.
				 *
				 * @optional
				 */
				Icon?: ComponentType | IconType

				/**
				 * Keyboard accelerator for the context menu item. It only works while the context menu is
				 * opened.
				 *
				 * @optional
				 */
				accelerator?: string
			}
		}
	}
}
