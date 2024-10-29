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

import type { BehaviorSubject, Observable } from "rxjs"

import type { ISO_639_1_Locale, TwoLetterLocale } from "@ordo-pink/locale"
import type { JTI, SUB } from "@ordo-pink/wjwt"
import type { Oath } from "@ordo-pink/oath"
import type { TLogger } from "@ordo-pink/logger"
import type { TOption } from "@ordo-pink/option"
import type { TResult } from "@ordo-pink/result"

import type * as C from "./constants"
import { TMaokaComponent } from "@ordo-pink/maoka"

export type TDropIsPrefix<T extends string> = T extends `is_${infer U}` ? U : never

export type TValidation<$TEntity extends Record<string, unknown>, $TKey extends keyof $TEntity> = (
	x: unknown,
) => x is $TEntity[$TKey]

export type TValidations<$TEntity extends Record<string, unknown>> = {
	[$TKey in keyof $TEntity extends string ? `is_${keyof $TEntity}` : never]: TValidation<
		$TEntity,
		TDropIsPrefix<$TKey>
	>
}

export type TFlattenRecord<T extends { key: string; value: any }> = {
	[K in T["key"]]: Extract<T, { key: K }>["value"]
}

export type TRecordToKVUnion<
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

declare global {
	/**
	 * This global interface provides support for autocompletion of translation
	 * keys in your function. You can extend this interface via custom global
	 * declaration. You can nest the objects, they will be converted into a dot
	 * separated string that starts with "t.your.nesting.blah-blah-blah". To denote
	 * the end of nesting, assign a type of `() => string`.
	 *
	 * @example
	 * ```typescript
	 * declare global {
	 * 	interface t {
	 * 		my_function {
	 * 			we_use_snake_case {
	 * 				to_annoy_javascript_people: () => string
	 * 			}
	 * 		}
	 * 	}
	 * }
	 *
	 * // This whole string will appear in autosuggestions
	 * t("t.my_function.we_use_snake_case.to_annoy_javascript_people")
	 * ```
	 */
	interface t {
		common: {
			state: {
				loading: () => string
			}
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
					reset: () => string
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

	/**
	 * This global interface provides support for autocompletion of command names
	 * in your function. You can extend this interface via custom global declaration.
	 * You can nest the objects, they will be converted into a dot separated string that
	 * starts with "cmd.your.nesting.blah-blah-blah". To denote the end of nesting, assign
	 * a thunk that returns the expected payload of the command. If the command does not
	 * expect any payload, assign a type of `() => void`.
	 *
	 * @example
	 * ```typescript
	 * declare global {
	 * 	interface cmd {
	 * 		my_function {
	 * 			actions {
	 * 				annoy: () => { really?: boolean }
	 * 			}
	 * 		}
	 * 	}
	 * }
	 *
	 * // This whole string will appear in suggestions, as well as expected payload type.
	 * commands.on("cmd.my_function.actions.annoy", ({ really }) => {
	 * 	really ? alert("BOO!") : console.log("BOO!")
	 * })
	 *
	 * // This whole string will appear in suggestions, as well as expected payload type.
	 * commands.emit("cmd.my_function.actions.annoy", { really: true })
	 * ```
	 */
	interface cmd {
		application: {
			set_title: () => Ordo.I18N.TranslationKey
			add_translations: () => {
				lang: ISO_639_1_Locale
				translations: Partial<Record<Ordo.I18N.TranslationKey, string>>
			}
			background_task: {
				set_status: () => C.BackgroundTaskStatus
				start_saving: () => void
				start_loading: () => void
				reset_status: () => void
			}
			notification: {
				show: () => Partial<Ordo.Notification.Instance> &
					Pick<Ordo.Notification.Instance, "message">
				hide: () => string
			}
			context_menu: {
				add: () => Ordo.ContextMenu.Item
				remove: () => string
				show: () => Omit<Ordo.ContextMenu.Instance, "structure">
				hide: () => void
			}
			command_palette: {
				add: () => Ordo.CommandPalette.Item
				remove: () => string
				toggle: () => void
				show: () => Ordo.CommandPalette.Instance
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
				navigate: () => Ordo.Router.NavigateParams | string
				open_external: () => Ordo.Router.OpenExternalParams
			}
			modal: {
				show: () => Ordo.Modal.Instance
				hide: () => void
			}
		}
		functions: {
			activities: {
				register: () => { fid: symbol; activity: Ordo.Activity.Instance }
				unregister: () => { fid: symbol; name: Ordo.Activity.Instance["name"] }
			}
			persisted_state: {
				update: () => { key: string; value: any }
			}
			file_associations: {
				add: () => Ordo.FileAssociation.Instance
				remove: () => Ordo.FileAssociation.Instance["name"]
			}
		}
		user: {
			achievement: {
				add: () => Ordo.Achievement.Instance
			}
			open_current_user_profile: () => void
			open_settings: () => void
			open_achievements: () => void
		}
		metadata: {
			create: () => Ordo.Metadata.CreateParams
			show_upload_modal: () => Ordo.Metadata.FSID | null
			show_create_modal: () => Ordo.Metadata.FSID | null
			show_remove_modal: () => Ordo.Metadata.FSID
			show_rename_modal: () => Ordo.Metadata.FSID
			show_edit_labels_palette: () => Ordo.Metadata.FSID
			show_edit_links_palette: () => Ordo.Metadata.FSID
			remove: () => Ordo.Metadata.FSID
			rename: () => { fsid: Ordo.Metadata.FSID; new_name: string }
			move: () => { fsid: Ordo.Metadata.FSID; new_parent: Ordo.Metadata.FSID | null }
			add_labels: () => { fsid: Ordo.Metadata.FSID; labels: Ordo.Metadata.Label[] }
			remove_labels: () => { fsid: Ordo.Metadata.FSID; labels: Ordo.Metadata.Label[] }
			add_links: () => { fsid: Ordo.Metadata.FSID; links: Ordo.Metadata.FSID[] }
			remove_links: () => { fsid: Ordo.Metadata.FSID; links: Ordo.Metadata.FSID[] }
			set_property: () => { fsid: Ordo.Metadata.FSID; key: string; value: any }
			set_size: () => { fsid: Ordo.Metadata.FSID; size: number }
		}
		content: {
			get: () => Ordo.Metadata.FSID
			set: () => { fsid: Ordo.Metadata.FSID; content: string | ArrayBuffer; content_type: string }
			upload: () => {
				name: string
				parent: Ordo.Metadata.FSID | null
				content: string | ArrayBuffer
				type: string
			}
		}
	}

	/**
	 * All public Ordo types belong here.
	 *
	 * @example
	 * ```typescript
	 * import "@ordo-pink/core"
	 *
	 * type TFoo = Ordo.<whatever_you_need_from_here>
	 * ```
	 */
	namespace Ordo {
		type Rrr<$TKey extends keyof typeof C.ErrorType = keyof typeof C.ErrorType> = {
			key: $TKey
			code: (typeof C.ErrorType)[$TKey]
			location: string
			debug?: any
		}

		type Fetch = typeof window.fetch

		type Hosts = { id: string; dt: string; static: string; website: string; my: string }

		/**
		 * User achievements and whatever else related to using them.
		 *
		 * NOTE: Granted achievements are persisted for the user. They can only be removed by direct
		 * user action.
		 *
		 * Achievements may be stacked together via the `previous` achievement DTO property which
		 * refers to the previous achievement in the stack. The following rules apply to displaying
		 * stacked achievements:
		 *
		 * - **if** previous achievement exists **and** was not completed, current achievement is
		 * not displayed
		 * - **if** previous achievement exists **and** was completed:
		 * 	- only the latest completed achievement in the stack is displayed as completed
		 * 	- only the first non-completed achievement in the stack is displayed as non-completed
		 * 	- all completed achievements earlier in the stack are displayed inside the latest completed
		 * 		achievement
		 * 	- only the first incomplete achievements is displayed as incomplete
		 * - **else**
		 * 	- current achievement is displayed depending on its completion status
		 */
		namespace Achievement {
			/**
			 * Achievement subscriber is designed to track user progress in terms of the achievement
			 * as well as update/grant the achievement based of what the user has achieved.
			 */
			namespace Subscriber {
				/**
				 * Subscribe function params.
				 *
				 * @see {@link Ordo.Achievement.Subscriber.Fn}
				 */
				type Params = {
					/**
					 * Update the achievement content. Useful for multistep achievements. Accepts a callback
					 * that encloses previous achievement {@link DTO} state.
					 */
					update: (f: (prev_state: Ordo.Achievement.DTO) => Ordo.Achievement.DTO) => void

					/**
					 * Grant the achievement to the user. Should be called if the user has completed of the
					 * required criteria.
					 */
					grant: () => void
				}

				/**
				 * Subscribe function is called once the achievement is registerred. Inside
				 * the function, any subscriptions to commands (or other means of tracking user
				 * progress) may be added.
				 *
				 * @see {@link Ordo.Achievement.Subscriber.Params}
				 */
				type Fn = (params: Ordo.Achievement.Subscriber.Params) => void
			}

			/**
			 * Transferrable achievement object.
			 */
			type DTO = {
				/**
				 * Achievement identifier.
				 *
				 * @unique Subsequent achievements with the same `id` are not registerred (first in).
				 */
				id: string

				/**
				 * Translation key of the title of the achievement.
				 *
				 * @see {@link Ordo.I18N.TranslationKey}
				 */
				title: Ordo.I18N.TranslationKey

				/**
				 * URL of the achievement icon. Should be at least 200x200px.
				 */
				image: string

				/**
				 * Translation key of the description of the achievement. The description should give a
				 * hint on how to obtain the achievement.
				 *
				 * @see {@link Ordo.I18N.TranslationKey}
				 */
				description: Ordo.I18N.TranslationKey

				/**
				 * Achievement `id` of the previous achievement in an achievement stack.
				 *
				 * @see {@link Ordo.Achievement}
				 */
				previous?: string

				/**
				 * Achievement completion date. `null` means the achievement was not completed.
				 */
				completed_at: Date | null

				/**
				 * Achievement category.
				 *
				 * @see {@link AchievementCategory}
				 */
				category: C.AchievementCategory
			}

			/**
			 * Achievement object being registerred in Ordo.
			 */
			type Instance = {
				/**
				 * Transferrable achievement object.
				 *
				 * @see {@link DTO}
				 */
				descriptor: DTO

				/**
				 * Achievement progress subscriber. Registerred once when the achievement itself
				 * is registerred.
				 *
				 * @see {@link Ordo.Achievement.Subscriber}
				 */
				subscribe: Ordo.Achievement.Subscriber.Fn
			}
		}

		namespace Workspace {
			type WorkspaceSplitSize = [number, number]
			type DisabledSidebar = { disabled: true }
			type EnabledSidebar = { disabled: false; sizes: WorkspaceSplitSize }
			type SidebarState = EnabledSidebar | DisabledSidebar
		}

		namespace CreateFunction {
			type QueryPermission =
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
				| "users.current_user.achievements"
				| "users.current_user.is_authenticated"
				| "users.current_user.public_info" // Ordo.User.Public.Instance
				| "users.current_user.internal_info" // Ordo.User.Current.Instance
				| "users.users_query"
				| "functions.activities"
				| "functions.current_file_association"
				| "functions.file_associations"
				| "functions.editor_plugins"
				| "functions.persisted_state"
				| "data.metadata_query"
				| "data.content_query"

			type CommandPermission = Ordo.Command.Name

			type GetCurrentRouteFn = () => TResult<
				Observable<TOption<Ordo.Router.Route>>,
				Ordo.Rrr<"EPERM">
			>

			// TODO Extract redundant types
			type GetSidebarFn = () => TResult<Observable<Ordo.Workspace.SidebarState>, Ordo.Rrr<"EPERM">>
			type GetTitleFn = () => TResult<Observable<string>, Ordo.Rrr<"EPERM">>
			type GetHostsFn = () => TResult<Ordo.Hosts, Ordo.Rrr<"EPERM">>
			type GetFetchFn = () => Ordo.Fetch
			type GetLoggerFn = () => TLogger
			type GetCommandsFn = () => Ordo.Command.Commands
			type GetIsAuthenticatedFn = () => TResult<Observable<boolean>, Ordo.Rrr<"EPERM">>
			type GetMetadataQueryFn = () => TResult<Ordo.Metadata.Query, Ordo.Rrr<"EPERM">>
			type GetContentQueryFn = () => TResult<Ordo.Content.Query, Ordo.Rrr<"EPERM">>
			type GetUserQueryFn = () => TResult<Ordo.User.Query, Ordo.Rrr<"EPERM">>
			type GetCurrentLanguageFn = () => TResult<Observable<TwoLetterLocale>, Ordo.Rrr<"EPERM">>
			type GetTranslationsFn = () => Observable<TOption<Ordo.I18N.Translations>>
			type SetCurrentActivityFn = (name: string) => TResult<void, Ordo.Rrr<"EPERM" | "ENOENT">>

			type GetCurrentActivityFn = () => TResult<
				Observable<TOption<Ordo.Activity.Instance>>,
				Ordo.Rrr<"EPERM" | "ENOENT">
			>

			type GetCurrentFileAssociationFn = () => TResult<
				Observable<TOption<Ordo.FileAssociation.Instance>>,
				Ordo.Rrr<"EPERM">
			>

			type GetFileAssociationsFn = () => TResult<
				Observable<Ordo.FileAssociation.Instance[]>,
				Ordo.Rrr<"EPERM">
			>

			type Permissions = {
				queries: Ordo.CreateFunction.QueryPermission[]
				commands: Ordo.CreateFunction.CommandPermission[]
			}

			type Params = {
				fid: symbol
				is_dev: boolean
				get_commands: GetCommandsFn
				get_sidebar: GetSidebarFn
				get_logger: GetLoggerFn
				get_current_route: GetCurrentRouteFn
				get_hosts: GetHostsFn
				get_is_authenticated: GetIsAuthenticatedFn
				get_fetch: GetFetchFn
				get_translations: GetTranslationsFn
				translate: Ordo.I18N.TranslateFn
				get_current_language: GetCurrentLanguageFn
				get_metadata_query: GetMetadataQueryFn
				get_user_query: GetUserQueryFn
				get_file_associations: GetFileAssociationsFn
				get_current_file_association: GetCurrentFileAssociationFn
				get_content_query: GetContentQueryFn
			}
		}

		namespace I18N {
			type TranslationKeys = TFlattenRecord<TRecordToKVUnion<t, "t">>
			type TranslationKey = keyof TranslationKeys
			type Translations = Record<TwoLetterLocale, Record<string, string>>
			type TranslateFn = {
				$: Observable<number>
				(key: Ordo.I18N.TranslationKey, default_value?: string): string
			}
		}

		namespace Activity {
			type OnUnmountParams = { workspace: HTMLDivElement; sidebar: HTMLDivElement }

			type Instance = {
				name: string
				routes: string[]
				default_route?: string
				render_workspace?: (div: HTMLDivElement) => void | Promise<void>
				render_sidebar?: (div: HTMLDivElement) => void | Promise<void>
				render_icon?: (span: HTMLSpanElement) => void | Promise<void>
				on_unmount?: (params: Ordo.Activity.OnUnmountParams) => void
				is_background?: boolean
				is_fullscreen?: boolean
			}
		}

		namespace FileAssociation {
			type RenderFn = (params: Ordo.FileAssociation.RenderParams) => void | Promise<void>

			type RenderIconFn = (span: HTMLSpanElement) => void | Promise<void>

			type Type = {
				name: string
				readable_name: Ordo.I18N.TranslationKey
				description: Ordo.I18N.TranslationKey
			}

			type Instance = {
				name: string
				types: Ordo.FileAssociation.Type[]
				render: RenderFn
				render_icon?: Ordo.FileAssociation.RenderIconFn
			}

			type RenderParams = {
				div: HTMLDivElement
				is_editable: boolean
				is_embedded: boolean
				content: Ordo.Content.Instance
				metadata: Ordo.Metadata.Instance
			}
		}

		namespace User {
			type Handle = `@${string}` // TODO Disallow forbidden chars
			type ID = `${string}-${string}-${string}-${string}-${string}` // TODO Strict type
			type Email = `${string}@${string}` // TODO Strict type

			namespace Current {
				type DTO = Ordo.User.Public.DTO & {
					email: Ordo.User.Email
					email_confirmed: boolean
					file_limit: number
					max_upload_size: number
					max_functions: number
					installed_functions: string[]
				}

				type Instance = Ordo.User.Public.Instance & {
					get_email: () => Ordo.User.Email
					is_email_confirmed: () => boolean
					get_file_limit: () => number
					get_max_upload_size: () => number
					get_max_functions: () => number
					get_installed_functions: () => string[]
					can_create_files: (number: number) => boolean
					can_upload: (bytes: number) => boolean
					can_add_function: () => boolean
					to_dto: () => Ordo.User.Current.DTO
				}

				type Validations = TValidations<Ordo.User.Current.DTO> & {
					is_dto: (x: unknown) => x is Ordo.User.Current.DTO
				}

				type Static = {
					FromDTO: (dto: Ordo.User.Current.DTO) => Ordo.User.Current.Instance
					Validations: Ordo.User.Current.Validations
				}

				type Repository = {
					get: () => TResult<Ordo.User.Current.Instance, Ordo.Rrr<"EAGAIN">>
					put: (user: Ordo.User.Current.Instance) => TResult<void, Ordo.Rrr<"EPERM" | "EINVAL">>
					get $(): Observable<number>
				}

				type RepositoryStatic = {
					Of: (
						$: BehaviorSubject<TOption<Ordo.User.Current.Instance>>,
					) => Ordo.User.Current.Repository
				}

				type RepositoryAsync = {
					get: (token: string) => Oath<Ordo.User.Current.Instance, Ordo.Rrr<"EIO" | "EINVAL">>
					put: (
						token: string,
						user: Ordo.User.Current.Instance,
					) => Oath<void, Ordo.Rrr<"EINVAL" | "EIO" | "EPERM">>
				}

				type RepositoryAsyncStatic = {
					Of: (id_host: string, fetch: Ordo.Fetch) => RepositoryAsync
				}
			}

			namespace Public {
				type DTO = {
					id: Ordo.User.ID
					created_at: Date
					subscription: C.UserSubscription
					handle: Ordo.User.Handle
					first_name?: string
					last_name?: string
				}

				type Validations = TValidations<Ordo.User.Public.DTO> & {
					is_dto: (x: unknown) => x is Ordo.User.Public.DTO
				}

				type Static = {
					FromDTO: (dto: Ordo.User.Public.DTO) => Ordo.User.Public.Instance
					Validations: Ordo.User.Public.Validations
				}

				type Instance = {
					get_id: () => Ordo.User.ID
					get_created_at: () => Date
					get_subscription: () => C.UserSubscription
					get_handle: () => Handle
					get_first_name: () => string
					get_last_name: () => string
					is_older_than: (date: Date) => boolean
					is_newer_than: (date: Date) => boolean
					get_full_name: () => string
					get_readable_name: () => string
					is_paid: () => boolean
					to_dto: () => Ordo.User.Public.DTO
				}

				type Repository = {
					get: () => Oath<Ordo.User.Public.Instance[], Ordo.Rrr<"EAGAIN">>
					put: (users: Ordo.User.Public.Instance[]) => Oath<void, Ordo.Rrr<"EINVAL">>
					get $(): Observable<number>
				}

				type RepositoryStatic = {
					Of: (known_user$: BehaviorSubject<Ordo.User.Public.Instance[]>) => Repository
				}
			}

			type Query = {
				get_current: () => TResult<Ordo.User.Current.Instance, Ordo.Rrr<"EAGAIN">>
				// get_current_by_id: (
				// id: Ordo.User.Current.Instance["id"],
				// ) => Oath<TOption<Ordo.User.Current.Instance>, Ordo.Rrr<"EAGAIN" | "EINVAL" | "EIO">>
				get_by_id: (
					email: Ordo.User.ID,
				) => Oath<TOption<Ordo.User.Public.Instance>, Ordo.Rrr<"EAGAIN" | "EINVAL" | "EIO">>

				// get_by_handle: (
				// handle: Ordo.User.Current.Instance["handle"],
				// ) => Oath<TOption<Ordo.User.Public.Instance>, Ordo.Rrr<"EAGAIN" | "EINVAL" | "EIO">>
				get $(): Observable<number>
			}

			type QueryStatic = {
				Of: (
					current_user_repository: Ordo.User.Current.Repository,
					public_user_repository: Ordo.User.Public.Repository,
				) => Ordo.User.Query
			}
		}

		namespace Content {
			type Instance = string | ArrayBuffer | null

			type Storage = Record<Ordo.Metadata.FSID, Ordo.Content.Instance>

			type RepositoryStatic = {
				Of: (content$: BehaviorSubject<Ordo.Content.Storage>) => Repository
			}

			type Repository = {
				get: () => TResult<Ordo.Content.Storage, Ordo.Rrr<"EAGAIN">>
				put: (content: Ordo.Content.Storage) => TResult<void, Ordo.Rrr<"EINVAL">>
				get $(): Observable<number>
			}

			type RepositoryAsyncStatic = {
				Of: (data_host: string, fetch: Ordo.Fetch) => RepositoryAsync
			}

			type RepositoryAsync = {
				get: (
					fsid: Ordo.Metadata.FSID,
					token: string,
				) => Oath<Ordo.Content.Instance, Ordo.Rrr<"EIO" | "EACCES" | "EINVAL" | "ENOENT">>
				put: (
					fsid: Ordo.Metadata.FSID,
					content: Ordo.Content.Instance,
					token: string,
				) => Oath<void, Ordo.Rrr<"EINVAL" | "EACCES" | "EIO">>
			}

			type QueryStatic = {
				Of: (repository: Ordo.Content.RepositoryAsync) => Ordo.Content.Query
			}

			type Query = {
				get: (
					fsid: Ordo.Metadata.FSID,
				) => Oath<Ordo.Content.Instance, Ordo.Rrr<"EIO" | "EACCES" | "EINVAL" | "ENOENT">>
			}
		}

		namespace Metadata {
			type FSID = `${string}-${string}-${string}-${string}-${string}`
			type Props = Readonly<Record<string, any>>

			type CreateParams<$TProps extends Ordo.Metadata.Props = Ordo.Metadata.Props> = Partial<
				Omit<
					Ordo.Metadata.DTO<$TProps>,
					"created_by" | "created_at" | "updated_at" | "updated_by" | "fsid"
				>
			> &
				Pick<Ordo.Metadata.DTO<$TProps>, "name" | "parent">

			type DTO<$TProps extends Ordo.Metadata.Props = Ordo.Metadata.Props> = Readonly<{
				fsid: Ordo.Metadata.FSID
				name: string
				parent: Ordo.Metadata.FSID | null
				links: Ordo.Metadata.FSID[]
				labels: Ordo.Metadata.Label[]
				type: string
				created_at: number
				created_by: Ordo.User.ID
				updated_at: number
				updated_by: Ordo.User.ID
				size: number
				props?: $TProps
			}>

			type Static = {
				Of: <$TProps extends Ordo.Metadata.Props = Ordo.Metadata.Props>(
					params: Ordo.Metadata.CreateParams<$TProps> & { author_id: Ordo.User.ID },
				) => Ordo.Metadata.Instance<$TProps>
				FromDTO: <$TProps extends Ordo.Metadata.Props = Ordo.Metadata.Props>(
					dto: Ordo.Metadata.DTO<$TProps>,
				) => Ordo.Metadata.Instance<$TProps>
				Validations: Ordo.Metadata.Validations
			}

			type Instance<$TProps extends Ordo.Metadata.Props = Ordo.Metadata.Props> = {
				get_fsid: () => Ordo.Metadata.FSID
				get_name: () => string
				get_parent: () => Ordo.Metadata.FSID | null
				is_root_child: () => boolean
				is_child_of: (parent: Ordo.Metadata.FSID) => boolean
				get_links: () => Ordo.Metadata.FSID[]
				has_links: () => boolean
				has_link_to: (link: Ordo.Metadata.FSID) => boolean
				get_labels: () => Ordo.Metadata.Label[]
				has_labels: () => boolean
				has_label: (label: string) => boolean
				get_type: () => string
				get_created_at: () => Date
				get_created_by: () => Ordo.User.ID
				get_updated_at: () => Date
				get_updated_by: () => Ordo.User.ID
				get_size: () => number
				get_readable_size: () => string
				get_property: <_TKey extends keyof $TProps>(
					key: _TKey,
				) => TOption<NonNullable<$TProps[_TKey]>>
				to_dto: () => Ordo.Metadata.DTO<$TProps>
				equals: (other_metadata?: Ordo.Metadata.Instance) => boolean
				is_item_of: (dto: Ordo.Metadata.DTO) => boolean
				is_hidden: () => boolean
			}

			type Validations = {
				is_metadata: (x: unknown) => x is Ordo.Metadata.Instance
				is_metadata_dto: (x: unknown) => x is Ordo.Metadata.DTO
				is_created_at: (x: unknown) => x is Date
				is_created_by: (x: unknown) => x is Ordo.User.ID
				is_updated_at: (x: unknown) => x is Date
				is_updated_by: (x: unknown) => x is Ordo.User.ID
				is_fsid: (x: unknown) => x is Ordo.Metadata.FSID
				is_label: (x: unknown) => x is Ordo.Metadata.Label
				is_link: (x: unknown) => x is Ordo.Metadata.FSID
				is_name: (x: unknown) => boolean
				is_parent: (x: unknown) => boolean
				is_prop_key: (x: unknown) => boolean
				is_props: (x: unknown) => boolean
				is_size: (x: unknown) => boolean
				is_type: (x: unknown) => boolean
				are_labels: (x: unknown) => boolean
				are_links: (x: unknown) => boolean
			}

			type Label =
				| string
				| {
						name: string
						readable_name: string
						color: string
				  }

			type RepositoryStatic = {
				Of: (metadata$: BehaviorSubject<Ordo.Metadata.Instance[] | null>) => Repository
			}

			type Repository = {
				get: () => TResult<Ordo.Metadata.Instance[], Ordo.Rrr<"EAGAIN">>
				put: (metadata: Ordo.Metadata.Instance[]) => TResult<void, Ordo.Rrr<"EINVAL">>
				get $(): Observable<number>
			}

			type RepositoryAsyncStatic = {
				Of: (data_host: string, fetch: Ordo.Fetch) => RepositoryAsync
			}

			type RepositoryAsync = {
				get: (token: string) => Oath<Ordo.Metadata.DTO[], Ordo.Rrr<"EIO">>
				put: (
					token: string,
					metadata: Ordo.Metadata.DTO[],
				) => Oath<void, Ordo.Rrr<"EINVAL" | "EIO">>
			}

			type QueryOptions = { show_hidden?: boolean }

			type QueryStatic = {
				Of: (repository: Ordo.Metadata.Repository) => Query
			}

			type Query = {
				get $(): Observable<number>

				get: (options?: QueryOptions) => TResult<Ordo.Metadata.Instance[], Ordo.Rrr<"EAGAIN">>

				get_by_fsid: (
					fsid: FSID,
					options?: QueryOptions,
				) => TResult<TOption<Ordo.Metadata.Instance>, Ordo.Rrr<"EAGAIN" | "EINVAL">>

				total: (options?: QueryOptions) => TResult<number, Ordo.Rrr<"EAGAIN">>

				get_by_name_and_parent: (
					name: string,
					parent: FSID | null,
					options?: QueryOptions,
				) => TResult<TOption<Ordo.Metadata.Instance>, Ordo.Rrr<"EAGAIN" | "EINVAL">>

				get_by_labels: (
					labels: string[],
					options?: QueryOptions,
				) => TResult<Ordo.Metadata.Instance[], Ordo.Rrr<"EAGAIN" | "EINVAL">>

				has_incoming_links: (
					fsid: FSID,
					options?: QueryOptions,
				) => TResult<boolean, Ordo.Rrr<"EAGAIN" | "EINVAL" | "ENOENT">>

				get_incoming_links: (
					fsid: FSID,
					options?: QueryOptions,
				) => TResult<Ordo.Metadata.Instance[], Ordo.Rrr<"EAGAIN" | "EINVAL" | "ENOENT">>

				get_parent: (
					fsid: FSID,
					options?: QueryOptions,
				) => TResult<TOption<Ordo.Metadata.Instance>, Ordo.Rrr<"EAGAIN" | "EINVAL" | "ENOENT">>

				get_ancestors: (
					fsid: FSID,
					options?: QueryOptions,
				) => TResult<Ordo.Metadata.Instance[], Ordo.Rrr<"EAGAIN" | "EINVAL" | "ENOENT">>

				has_ancestor: (
					fsid: FSID,
					ancestor: FSID,
					options?: QueryOptions,
				) => TResult<boolean, Ordo.Rrr<"EAGAIN" | "EINVAL" | "ENOENT">>

				has_child: (
					fsid: FSID,
					child: FSID,
					options?: QueryOptions,
				) => TResult<boolean, Ordo.Rrr<"EAGAIN" | "EINVAL" | "ENOENT">>

				has_children: (
					fsid: FSID,
					options?: QueryOptions,
				) => TResult<boolean, Ordo.Rrr<"EAGAIN" | "EINVAL" | "ENOENT">>

				get_children: (
					fsid: FSID | null,
					options?: QueryOptions,
				) => TResult<Ordo.Metadata.Instance[], Ordo.Rrr<"EAGAIN" | "EINVAL" | "ENOENT">>

				has_descendent: (
					fsid: FSID,
					descendent: FSID,
					options?: QueryOptions,
				) => TResult<boolean, Ordo.Rrr<"EAGAIN" | "EINVAL" | "ENOENT">>

				has_descendents: (
					fsid: FSID,
					options?: QueryOptions,
				) => TResult<boolean, Ordo.Rrr<"EAGAIN" | "EINVAL" | "ENOENT">>

				get_descendents: (
					fsid: FSID,
					options?: QueryOptions,
					accumulator?: Ordo.Metadata.Instance[],
				) => TResult<Ordo.Metadata.Instance[], Ordo.Rrr<"EAGAIN" | "EINVAL" | "ENOENT">>

				// TODO: toTree: (source: TFSID | null) => typeof source extends null ? Ordo.Metadata.ItemBranch[] : Ordo.Metadata.ItemBranch

				// TODO: toGraph: (
				// 	source: TFSID | null,
				// ) => typeof source extends null ? Ordo.Metadata.ItemBranchWithLinks[] : Ordo.Metadata.ItemBranchWithLinks
			}

			type CommandStatic = {
				Of: (
					metadata_repository: Ordo.Metadata.Repository,
					metadata_query: Ordo.Metadata.Query,
					user_query: Ordo.User.Query,
				) => Ordo.Metadata.Command
			}

			type Command = {
				create: (
					params: Ordo.Metadata.CreateParams,
				) => TResult<void, Ordo.Rrr<"EAGAIN" | "EEXIST" | "EINVAL" | "ENOENT">>

				replace: (
					value: Ordo.Metadata.Instance,
				) => TResult<void, Ordo.Rrr<"EAGAIN" | "ENOENT" | "EINVAL">>

				remove: (
					fsid: Ordo.Metadata.FSID,
				) => TResult<void, Ordo.Rrr<"EAGAIN" | "EINVAL" | "ENOENT">>

				append_child: (
					fsid: Ordo.Metadata.FSID,
					child: Ordo.Metadata.FSID,
				) => TResult<void, Ordo.Rrr<"EAGAIN" | "EINVAL" | "ENOENT" | "EEXIST" | "ENXIO">>

				add_labels: (
					fsid: Ordo.Metadata.FSID,
					...labels: Ordo.Metadata.Label[]
				) => TResult<void, Ordo.Rrr<"EAGAIN" | "EINVAL" | "ENOENT">>

				remove_labels: (
					fsid: Ordo.Metadata.FSID,
					...labels: Ordo.Metadata.Label[]
				) => TResult<void, Ordo.Rrr<"EAGAIN" | "EINVAL" | "ENOENT">>

				replace_labels: (
					fsid: Ordo.Metadata.FSID,
					labels: Ordo.Metadata.Label[],
				) => TResult<void, Ordo.Rrr<"EAGAIN" | "EINVAL" | "ENOENT">>

				set_size: (
					fsid: Ordo.Metadata.FSID,
					size: number,
				) => TResult<void, Ordo.Rrr<"EAGAIN" | "EINVAL" | "ENOENT">>

				add_links: (
					fsid: Ordo.Metadata.FSID,
					...links: Ordo.Metadata.FSID[]
				) => TResult<void, Ordo.Rrr<"EAGAIN" | "EINVAL" | "ENOENT">>

				remove_links: (
					fsid: Ordo.Metadata.FSID,
					...links: Ordo.Metadata.FSID[]
				) => TResult<void, Ordo.Rrr<"EAGAIN" | "EINVAL" | "ENOENT">>

				replace_links: (
					fsid: Ordo.Metadata.FSID,
					links: Ordo.Metadata.FSID[],
				) => TResult<void, Ordo.Rrr<"EAGAIN" | "EINVAL" | "ENOENT">>

				set_parent: (
					fsid: Ordo.Metadata.FSID,
					parent: Ordo.Metadata.FSID | null,
				) => TResult<void, Ordo.Rrr<"EAGAIN" | "EINVAL" | "ENOENT" | "ENXIO" | "EEXIST">>

				set_name: (
					fsid: Ordo.Metadata.FSID,
					name: string,
				) => TResult<void, Ordo.Rrr<"EAGAIN" | "EINVAL" | "ENOENT" | "EEXIST">>

				set_property: <$TProps extends Ordo.Metadata.Props, $TKey extends keyof $TProps>(
					fsid: Ordo.Metadata.FSID,
					key: $TKey,
					value: $TProps[$TKey],
				) => TResult<void, Ordo.Rrr<"EAGAIN" | "EINVAL" | "ENOENT">>

				remove_property: <$TProps extends Ordo.Metadata.Props, $TKey extends keyof $TProps>(
					fsid: Ordo.Metadata.FSID,
					key: $TKey,
				) => TResult<void, Ordo.Rrr<"EAGAIN" | "EINVAL" | "ENOENT">>
			}
		}

		namespace Command {
			type Record = TFlattenRecord<TRecordToKVUnion<cmd, "cmd">>
			type Name = keyof Record

			/**
			 * Command without payload.
			 */
			type Command<$TName extends Ordo.Command.Name = Ordo.Command.Name> = {
				name: $TName
				key?: string
			}

			/**
			 * Command with payload.
			 */
			type PayloadCommand<
				$TName extends Ordo.Command.Name = Ordo.Command.Name,
				$TPayload = any,
			> = Command<$TName> & { payload: $TPayload }

			/**
			 * Command handler.
			 */
			type TCommandHandler<$TPayload> = (payload: $TPayload) => unknown

			type OnFn = <$TKey extends Ordo.Command.Name>(
				name: $TKey,
				handler: TCommandHandler<Ordo.Command.Record[$TKey]>,
			) => void

			type OffFn = <$TKey extends Ordo.Command.Name>(
				name: $TKey,
				handler: TCommandHandler<Ordo.Command.Record[$TKey]>,
			) => void

			type EmitFn = <$TKey extends Ordo.Command.Name>(
				name: $TKey,
				...rest: Ordo.Command.Record[$TKey] extends void
					? [key?: string]
					: [payload: Ordo.Command.Record[$TKey], key?: string]
			) => void

			type CancelFn = <$TKey extends Ordo.Command.Name>(
				name: $TKey,
				payload?: Ordo.Command.Record[$TKey],
				key?: string,
			) => void

			type Commands = {
				/**
				 * Append a listener to a given command.
				 */
				on: Ordo.Command.OnFn

				/**
				 * Remove given listener for a given command. Make sure you provide a reference to the same
				 * function as you did when calling `on`.
				 */
				off: Ordo.Command.OffFn

				/**
				 * Emit given command with given payload. You can provide an optional key that you can use
				 * later to apply targeted cancellation for the command. Emission does not happen if there
				 * is a command with given key already.
				 */
				emit: Ordo.Command.EmitFn

				/**
				 * Cancel a command with given payload. If you provided a key when emitting the command,
				 * you can provide it for targeted cancellation.
				 */
				cancel: Ordo.Command.CancelFn
			}
		}

		namespace Modal {
			type Instance = {
				show_close_button?: boolean
				on_unmount?: () => void
				render: (div: HTMLDivElement) => void
			}
		}

		namespace Router {
			/**
			 * Route descriptor to be passed for navigating.
			 */
			type RouteConfig = {
				route: string
				queryString?: string | Record<string, string>
				pageTitle?: string
				data?: Record<string, unknown>
				preserveQuery?: boolean
				replace?: boolean
				exec?: boolean
			}

			type NavigateParams = [routeConfig: string | RouteConfig, replace?: boolean, exec?: boolean]

			type OpenExternalParams = { url: string; new_tab?: boolean }

			type Route<
				$TParams extends Record<string, string | undefined> = Record<string, string | undefined>,
				$TData = null,
			> = {
				params?: $TParams
				data: $TData
				hash: string
				hashRouting: boolean
				search: string
				path: string
				route: string
			}
		}

		namespace Notification {
			type Instance = {
				id: string
				type: C.NotificationType
				title?: Ordo.I18N.TranslationKey
				message: Ordo.I18N.TranslationKey
				render_icon?: (div: HTMLDivElement) => void
				duration?: number
				on_click?: () => void
				// persist?: boolean
				// payload?: T
				// action?: (id: string, payload: T) => void
				// action_text?: Ordo.I18N.TranslationKey
			}
		}

		namespace ContextMenu {
			/**
			 * Context menu item.
			 */
			type Item = {
				/**
				 * Check whether the item needs to be shown.
				 */
				should_show: (params: Ordo.ContextMenu.Params) => boolean

				/**
				 * @see ItemType
				 */
				type: C.ContextMenuItemType

				/**
				 * Name of the command to be invoked when the context menu item is used.
				 */
				command: Ordo.Command.Name

				/**
				 * Readable name of the context menu item. Put a translated value here.
				 */
				readable_name: Ordo.I18N.TranslationKey

				/**
				 * Icon to be displayed for the context menu item.
				 */
				render_icon?: (div: HTMLDivElement) => void

				/**
				 * Keyboard hotkey for the context menu item. It only works while the context menu is
				 * opened.
				 *
				 * @optional
				 */
				hotkey?: string

				/**
				 * Check whether the item needs to be shown disabled.
				 *
				 * @optional
				 * @default () => false
				 */
				should_be_disabled?: (params: Ordo.ContextMenu.Params) => boolean

				/**
				 * This function allows you to override the incoming payload that will be passed to the command
				 * invoked by the context menu item.
				 *
				 * @optional
				 * @default () => payload
				 */
				payload_creator?: (params: Ordo.ContextMenu.Params) => unknown
			}

			/**
			 * Context menu item method parameters.
			 */
			type Params = { event: MouseEvent; payload?: unknown }

			/**
			 * Context menu.
			 */
			type Instance = {
				/**
				 * Accepted mouse event.
				 */
				event: MouseEvent

				/**
				 * Payload to be passed to the context menu item methods.
				 */
				payload?: unknown

				/**
				 * Avoid showing create items.
				 */
				hide_create_items?: boolean

				/**
				 * Avoid showing read items.
				 */
				hide_read_items?: boolean

				/**
				 * Avoid showing update items.
				 */
				hide_update_items?: boolean

				/**
				 * Avoid showing delete items.
				 */
				hide_delete_items?: boolean

				/**
				 * Items to be shown in the context menu.
				 */
				structure: Ordo.ContextMenu.Item[]
			}
		}

		namespace CommandPalette {
			type Instance = {
				items: Ordo.CommandPalette.Item[]
				on_new_item?: (new_item: string) => any
				is_multiple?: boolean
				pinned_items?: Ordo.CommandPalette.Item[]
				max_items?: number
			}

			/**
			 * Command palette item.
			 */
			type Item = {
				/**
				 * Readable name of the command palette item. Put a translation key here, if you use i18n.
				 */
				readable_name: Ordo.I18N.TranslationKey

				/**
				 * Action to be executed when command palette item is used.
				 */
				on_select: () => void

				/**
				 * Icon to be displayed for the context menu item.
				 *
				 * @optional
				 */
				render_icon?: (div: HTMLDivElement) => void | Promise<void>

				/**
				 * Keyboard hotkey for the context menu item. It only works while the context menu is
				 * opened.
				 *
				 * @optional
				 */
				hotkey?: string

				description?: Ordo.I18N.TranslationKey

				render_custom_footer?: () => TMaokaComponent // TODO Use standard render approach
				render_custom_info?: () => TMaokaComponent // TODO Use standard render approach
			}
		}

		namespace Routes {
			type TSuccessResponse<T> = { success: true; result: T }
			type TErrorResponse = { success: false; error: string }
			type TTokenResult = {
				sub: SUB
				jti: JTI
				expires: Date
				token: string
				file_limit: Ordo.User.Current.DTO["file_limit"]
				subscription: Ordo.User.Current.DTO["subscription"]
				max_upload_size: Ordo.User.Current.DTO["max_upload_size"]
				max_functions: Ordo.User.Current.DTO["max_functions"]
			}

			namespace DT {
				namespace SyncMetadata {
					type Path = `/${Ordo.User.Current.DTO["id"]}`
					type Method = "POST"
					type Cookies = void
					type Params = void
					type RequestBody = Ordo.Metadata.DTO[] // TODO: Replace with array of atomic changes
					type StatusCode = 200
					type ResponseBody = string
				}

				namespace GetContent {
					type Path = `/${Ordo.User.Current.DTO["id"]}/${Ordo.Metadata.FSID}`
					type Method = "GET"
					type Cookies = void
					type Params = { user_id?: string; fsid?: string }
					type RequestBody = void
					type StatusCode = 200
					type ResponseBody = string | ArrayBuffer
				}

				namespace SetContent {
					type Path =
						`/${Ordo.User.Current.DTO["id"]}/${Ordo.Metadata.FSID}/${Ordo.Metadata.DTO["type"]}`
					type Method = "PUT"
					type Cookies = void
					type Params = { user_id?: string; fsid?: string }
					type RequestBody = string | ArrayBuffer
					type StatusCode = 204
					type ResponseBody = void
				}

				namespace CreateContent {
					type Path = `/${Ordo.User.Current.DTO["id"]}`
					type Url =
						`${string}${Path}?name=${string}&parent=${Ordo.Metadata.DTO["parent"]}&content_type=${Ordo.Metadata.DTO["type"]}`
					type Method = "POST"
					type Cookies = void
					type Params = { user_id?: string; name?: string; parent?: string }
					type RequestBody = string | ArrayBuffer
					type StatusCode = 201
					type ResponseBody = void
				}
			}

			namespace ID {
				namespace UpdateInfo {
					type Path = "/account/info"
					type Method = "PATCH"
					type Cookies = void
					type Params = void
					type RequestBody = { first_name?: string; last_name?: string }
					type StatusCode = 200
					type ResponseBody = Ordo.User.Current.DTO

					type Request = {
						path: Path
						method: Method
						cookies: Cookies
						params: Params
						body: RequestBody
					}
					type Response = { status: StatusCode; body: ResponseBody }
				}

				namespace UpdateEmail {
					type Path = "/account/email"
					type Method = "PATCH"
					type Cookies = void
					type Params = void
					type StatusCode = 200
					type RequestBody = { email?: string }
					type ResponseBody = Ordo.User.Current.DTO

					type Request = {
						path: Path
						method: Method
						cookies: Cookies
						params: Params
						body: RequestBody
					}
					type Response = { status: StatusCode; body: ResponseBody }
				}

				namespace UpdateHandle {
					type Path = "/account/handle"
					type Method = "PATCH"
					type Cookies = void
					type Params = void
					type StatusCode = 200
					type RequestBody = { handle?: string }
					type ResponseBody = Ordo.User.Current.DTO

					type Request = {
						path: Path
						method: Method
						cookies: Cookies
						params: Params
						body: RequestBody
					}
					type Response = { status: StatusCode; body: ResponseBody }
				}

				namespace UpdatePassword {
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

				namespace ConfirmEmail {
					type Path = "/account/confirm-email"
					type Url = `${string}${Path}?email=${string}&code=${string}` // TODO: Define host
					type Method = "POST"
					type Cookies = void
					type Params = void
					type StatusCode = 200
					type RequestBody = { email?: string; code?: string }
					type ResponseBody = Ordo.User.Current.DTO

					type Request = {
						path: Path
						method: Method
						cookies: Cookies
						params: Params
						body: RequestBody
					}
					type Response = { status: StatusCode; body: ResponseBody }
				}

				namespace GetAccount {
					type Path = "/account"
					type Method = "GET"
					type Cookies = void
					type Params = void
					type RequestBody = void
					type StatusCode = 200
					type ResponseBody = Ordo.User.Current.DTO

					type Request = {
						path: Path
						method: Method
						cookies: Cookies
						params: Params
						body: RequestBody
					}
					type Response = { status: StatusCode; body: ResponseBody }
				}

				namespace GetUserByEmail {
					type Path = `/users/email/${string}`
					type Method = "GET"
					type Cookies = void
					type Params = { email?: string }
					type RequestBody = void
					type StatusCode = 200
					type ResponseBody = Ordo.User.Public.DTO

					type Request = {
						path: Path
						method: Method
						cookies: Cookies
						params: Params
						body: RequestBody
					}
					type Response = { status: StatusCode; body: ResponseBody }
				}

				namespace GetUserByHandle {
					type Path = `/users/handle/${string}`
					type Method = "GET"
					type Cookies = void
					type Params = { handle?: string }
					type RequestBody = void
					type StatusCode = 200
					type ResponseBody = Ordo.User.Public.DTO

					type Request = {
						path: Path
						method: Method
						cookies: Cookies
						params: Params
						body: RequestBody
					}
					type Response = { status: StatusCode; body: ResponseBody }
				}

				namespace GetUserByID {
					type Path = `/users/id/${string}`
					type Method = "GET"
					type Cookies = void
					type Params = { id?: string }
					type RequestBody = void
					type StatusCode = 200
					type ResponseBody = Ordo.User.Public.DTO

					type Request = {
						path: Path
						method: Method
						cookies: Cookies
						params: Params
						body: RequestBody
					}
					type Response = { status: StatusCode; body: ResponseBody }
				}

				namespace RefreshToken {
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

				namespace SignIn {
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

				namespace SignUp {
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

				namespace SignOut {
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

				namespace VerifyToken {
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
	}
}
