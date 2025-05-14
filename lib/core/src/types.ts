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

import type { Logger } from "@ordo-pink/logger"
import type { Oath } from "@ordo-pink/oath"
import type { TResult } from "@ordo-pink/result"
import type { TWO_LETTER_LOCALE } from "@ordo-pink/locale"
import type { Zags } from "@ordo-pink/zags"

import type * as C from "./constants"
import { Hunt } from "@ordo-pink/hunt"
import { MODAL_SIZE } from "./constants"
import { RoutaryBrowser } from "@ordo-pink/routary-browser"

export type TDropIsPrefix<T extends string> = T extends `is_${infer U}` ? U : never

export type TValidation<$TEntity extends Record<string, unknown>, $TKey extends keyof $TEntity> = (
	x: unknown,
) => x is $TEntity[$TKey]

export type TValidations<$TEntity extends Record<string, unknown>> = {
	[$TKey in keyof $TEntity extends string ? `is_${Lowercase<keyof $TEntity>}` : never]: TValidation<
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
			ok: () => string
			cancel: () => string
			search: () => string
			yes: () => string
			no: () => string
			apply: () => string
			save: () => string
			load: () => string
			error: {
				eexist: () => string
			}
			state: {
				loading: () => string
				saving: () => string
			}
			urls: {
				twitter_x: () => string
				support_email: () => string
				support_messenger: () => string
				contact_us: () => string
			}
			metadata: {
				show_edit_labels_palette: () => string
				show_edit_label_modal: () => string
				show_edit_links_palette: () => string
			}
			components: {
				modals: {
					create_file: {
						title: () => string
						input_placeholder: () => string
						input_label: () => string
					}
					move: {
						title: () => string
						move_to_root: () => string
					}
					remove_file: {
						title: () => string
						message: () => string
					}
					rename_file: {
						title: () => string
						input_label: () => string
					}
				}
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
				notifications: {
					pending_notifications: () => string
				}
			}
		}
		file_editor: {
			command_palette: {
				open: () => string
				open_file: () => string
			}
		}
		welcome: {
			go_to_welcome_page: () => string
			command_palette: {
				support: {
					open_support_palette: () => string
					email: () => string
					messenger: () => string
				}
			}
			start_page: {
				title: () => string
				news_widget: {
					title: () => string
				}
			}
			landing_page: {
				title: () => string
				cookie_banner: {
					title: () => string
					message: () => string
				}
				sections: {
					hero: {
						beta_started_announcement: () => string
						learn_more: () => string
						try_now_button: () => string
						sign_up: () => string
					}
				}
			}
		}
		auth: {
			leave: () => string
			join: () => string
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
		command_palette: {
			add: { args: Ordo.CommandPalette.Item<() => void> }
			remove: { args: string | number }
			toggle: { args: void }
			show: { args: Ordo.CommandPalette.Instance | undefined }
			hide: { args: void }
		}
		auth: {
			show_request_code_modal: { args: void }
			show_verify_code_modal: { args: void }
			sign_out: { args: void }
		}
		modal: {
			show: { args: Ordo.Modal.Params }
			hide: { args: void }
		}
		router: {
			set_hash: { args: string }
			set_href: { args: string }
			set_pathname: { args: string }
			set_search: { args: string | Record<string, string> }
		}
		// application: {
		// 	set_title: () => Ordo.I18N.TranslationKey
		// 	add_translations: () => {
		// 		lang: keyof Ordo.I18N.Translations
		// 		translations: Partial<Record<Ordo.I18N.TranslationKey, string>>
		// 	}
		// 	set_language: () => keyof Ordo.I18N.Translations
		// 	background_task: {
		// 		set_status: () => C.BackgroundTaskStatus
		// 		start_saving: () => void
		// 		start_loading: () => void
		// 		reset_status: () => void
		// 	}
		// 	notification: {
		// 		show: () => Partial<Ordo.Notification.Instance> & Pick<Ordo.Notification.Instance, "message">
		// 		hide: () => string
		// 	}
		// 	context_menu: {
		// 		add: () => Ordo.ContextMenu.Item
		// 		remove: () => string
		// 		show: () => Omit<Ordo.ContextMenu.Instance, "structure">
		// 		hide: () => void
		// 	}

		// 	sidebar: {
		// 		enable: () => void
		// 		disable: () => void
		// 		show: () => void
		// 		hide: () => void
		// 		toggle: () => void
		// 	}
		// 	router: {
		// 		navigate: () => { url: Ordo.Router.Route["pathname"]; new_tab?: boolean }
		// 		open_external: () => Ordo.Router.OpenExternalParams
		// 	}
		// 	modal: {
		// 		show: () => Ordo.Modal.Instance
		// 		hide: () => void
		// 	}
		// }
		// functions: {
		// 	activities: {
		// 		register: () => Ordo.Activity.Instance
		// 		unregister: () => Ordo.Activity.Instance["name"]
		// 	}
		// 	persisted_state: {
		// 		update: () => { key: string; value: any }
		// 	}
		// 	file_associations: {
		// 		register: () => Ordo.FileAssociation.Instance
		// 		unregister: () => Ordo.FileAssociation.Instance["name"]
		// 	}
		// }
		// user: {
		// 	achievement: {
		// 		add: () => Ordo.Achievement.Instance
		// 	}
		// 	open_achievements: () => void
		// 	open_current_user_profile: () => void
		// 	open_settings: () => void
		// }
		// metadata: {
		// 	add_labels: () => { fsid: Ordo.Metadata.FSID; labels: Ordo.Metadata.Label[] }
		// 	add_links: () => { fsid: Ordo.Metadata.FSID; links: Ordo.Metadata.FSID[] }
		// 	create: () => Ordo.Metadata.CreateParams
		// 	edit_label: () => { old_label: Ordo.Metadata.Label; new_label: Ordo.Metadata.Label }
		// 	move: () => { fsid: Ordo.Metadata.FSID; new_parent: Ordo.Metadata.FSID | null }
		// 	open_published_page: () => Ordo.Metadata.FSID
		// 	publish: () => Ordo.Metadata.FSID
		// 	remove_labels: () => { fsid: Ordo.Metadata.FSID; labels: Ordo.Metadata.Label[] }
		// 	remove_links: () => { fsid: Ordo.Metadata.FSID; links: Ordo.Metadata.FSID[] }
		// 	remove: () => Ordo.Metadata.FSID
		// 	rename: () => { fsid: Ordo.Metadata.FSID; new_name: string }
		// 	set_property: () => { fsid: Ordo.Metadata.FSID; key: string; value: any }
		// 	set_size: () => { fsid: Ordo.Metadata.FSID; size: number }
		// 	show_create_modal: () => Ordo.Metadata.FSID | null
		// 	show_edit_label_modal: () => Ordo.Metadata.Label
		// 	show_edit_labels_palette: () => Ordo.Metadata.FSID
		// 	show_edit_links_palette: () => { fsid: Ordo.Metadata.FSID; type: "incoming" | "outgoing" }
		// 	show_move_palette: () => Ordo.Metadata.FSID
		// 	show_publish_modal: () => Ordo.Metadata.FSID
		// 	show_remove_modal: () => Ordo.Metadata.FSID
		// 	show_rename_modal: () => Ordo.Metadata.FSID
		// 	show_upload_modal: () => Ordo.Metadata.FSID | null
		// 	unpublish: () => Ordo.Metadata.FSID
		// }
		// content: {
		// 	set: () => { content_type: string; content: Ordo.Content.Instance; fsid: Ordo.Metadata.FSID }
		// 	upload: () => { content: Ordo.Content.Instance; name: string; parent: Ordo.Metadata.FSID | null; type: string }
		// 	remove: () => Ordo.Metadata.FSID
		// }
		// file_editor: { open_file: () => Ordo.Metadata.FSID; open: () => void }
		// welcome: {
		// 	go_to_email_support: () => void
		// 	go_to_messenger_support: () => void
		// 	go_to_welcome_page: () => void
		// 	open_support_palette: () => void
		// }
		// auth: {
		// 	request_code: (email: Ordo.User.Email) => void
		// 	show_request_code_modal: () => void
		// 	show_validate_code_modal: () => Ordo.User.Email
		// 	validate_code: (email: Ordo.User.Email, code: string) => void
		// }
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
		type Rrr<$TKey extends keyof typeof C.ERROR_TYPE = keyof typeof C.ERROR_TYPE> = {
			key: $TKey
			code: (typeof C.ERROR_TYPE)[$TKey]
			message: string
			debug?: any
		}

		type Preys = Pick<cmd, keyof cmd>

		type Hunter = Hunt.Instance<Preys>

		type State = {
			fetch: Ordo.Fetch
			hosts: Ordo.Hosts
			translate: Ordo.I18N.TranslateFn
			logger: Logger
			hunter: Ordo.Hunter
			rotor$: RoutaryBrowser.Instance["$"]
			// TODO: zags: Ordo.Rings
		}

		export type GunFor<$Prey extends keyof Hunt.Pouch.ToPreys<Ordo.Preys>> = Hunt.GunFor<Hunt.Pouch.ToPreys<Ordo.Preys>, $Prey>

		type Fetch = typeof window.fetch

		type Hosts = { au: string; fn: string; id: string; dt: string; pb: string; web: string }

		type DTOLike<$TDTO extends any[]> = [...$TDTO, ...any]

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
				category: C.ACHIEVEMENT_CATEGORY
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

		namespace CreateFunction {
			type QueryPermission =
				| "application.fetch"
				| "application.router"
				| "application.file_associations"
				| `metadata.${keyof Ordo.Metadata.Query}`
				| `user.${keyof Ordo.User.Query}`
				| `content.${keyof Ordo.Content.Query}`

			type CommandPermission = keyof Ordo.Preys

			type Permissions = {
				queries: Ordo.CreateFunction.QueryPermission[]
				commands: Ordo.CreateFunction.CommandPermission[]
			}

			type Fn = (
				name: string,
				permissions: Ordo.CreateFunction.Permissions,
				callback: (context: Ordo.State) => void | Promise<void>,
			) => (params: OrdoInternal.Function.CreateFunctionInternalContext) => void | Promise<void>
		}

		namespace I18N {
			type TranslationKeys = TFlattenRecord<TRecordToKVUnion<t, "t">>
			type TranslationKey = keyof TranslationKeys
			type Translations = Record<TWO_LETTER_LOCALE, Record<TranslationKey, string>>
			type TranslateFn = {
				(key: Ordo.I18N.TranslationKey, default_value?: string): string
				$: Zags.Instance<{ version: number }>
			}
		}

		namespace Activity {
			type OnUnmountParams = { workspace: HTMLDivElement; sidebar: HTMLDivElement }

			type Instance = {
				name: string
				routes: `/${string}`[]
				default_route?: `/${string}`
				render_workspace?: (div: HTMLDivElement) => void | Promise<void>
				render_sidebar?: (div: HTMLDivElement) => void | Promise<void>
				render_icon?: (span: HTMLSpanElement) => void | Promise<void>
				onunmount?: (params: Ordo.Activity.OnUnmountParams) => void
				is_background?: boolean
				is_fullscreen?: boolean
			}
		}

		namespace FileAssociation {
			type RenderFn = (params: Ordo.FileAssociation.RenderParams) => void | Promise<void>

			type RenderToStringFn = (params: Ordo.FileAssociation.RenderParams) => string | Promise<string>

			type RenderIconFn = (span: HTMLSpanElement) => void | Promise<void>

			type Type = {
				description: Ordo.I18N.TranslationKey
				name: string
				readable_name: Ordo.I18N.TranslationKey
			}

			// TODO Support for marking files as remote-only
			type Instance = {
				name: string
				render_icon?: Ordo.FileAssociation.RenderIconFn
				content_to_string?: {
					render?: Ordo.FileAssociation.RenderToStringFn
					styles?: string[]
				}
				render: RenderFn
				types: Ordo.FileAssociation.Type[]
			}

			type RenderParams = {
				div: HTMLDivElement
				content: Ordo.Content.Instance
				is_editable: boolean
				is_embedded: boolean
				metadata: Ordo.Metadata.Instance
			}
		}

		namespace User {
			type Handle = `@${string}` // TODO Disallow forbidden chars
			type UID = `${string}-${string}-${string}-${string}-${string}`
			type Email = `${string}@${string}.${string}`
			type SessionID = `${string}-${string}-${string}-${string}-${string}`
			type Session = [SessionID, number, string?]

			namespace Current {
				type DTO = [...Ordo.User.Public.DTO, Ordo.User.Email, number, string[], number, number, Session[]]

				type Instance = Omit<Ordo.User.Public.Instance, "to_dto"> & {
					can_add_function: () => boolean
					can_create_files: (number: number) => boolean
					can_upload: (bytes: number) => boolean
					get_email: () => Ordo.User.Email
					get_file_limit: () => number
					get_installed_functions: () => string[]
					get_max_functions: () => number
					get_max_upload_size: () => number
					get_sessions: () => Session[]
					to_dto: () => Ordo.User.Current.DTO
				}

				type Validations = TValidations<{
					[$TKey in keyof typeof C.CURRENT_USER_KEYS]: (
						x: unknown,
					) => x is Ordo.User.Current.DTO[(typeof C.CURRENT_USER_KEYS)[$TKey]]
				}> & {
					is_dto: (x: unknown) => x is Ordo.User.Current.DTO
				}

				type Static = {
					from_dto: (dto: Ordo.DTOLike<Ordo.User.Current.DTO>) => Ordo.User.Current.Instance
					new: (
						email: Ordo.User.Email,
						file_limit: number,
						max_upload_size: number,
						max_functions: number,
						subscription?: C.USER_SUBSCRIPTION,
					) => Ordo.User.Current.Instance
					serialize: (dto: Ordo.DTOLike<Ordo.User.Current.DTO>) => Ordo.User.Current.DTO
					validations: Ordo.User.Current.Validations
				}
			}

			namespace Public {
				type DTO = [Ordo.User.UID, Ordo.User.Handle, number, C.USER_SUBSCRIPTION, string?, string?]

				type Validations = TValidations<{
					[$TKey in keyof typeof C.PUBLIC_USER_KEYS]: Ordo.User.Current.DTO[(typeof C.PUBLIC_USER_KEYS)[$TKey]]
				}> & {
					is_dto: (x: unknown) => x is Ordo.User.Public.DTO
				}

				type Static = {
					from_dto: (dto: Ordo.User.Public.DTO) => Ordo.User.Public.Instance
					serialize: <$TDTO extends [...Ordo.User.Public.DTO, ...any]>(dto: $TDTO) => Ordo.User.Public.DTO
					validations: Ordo.User.Public.Validations
				}

				type Instance = {
					get_uid: () => Ordo.User.UID
					get_created_at: () => Date
					get_subscription: () => C.USER_SUBSCRIPTION
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
			}

			type Query = {
				is_authenticated: () => boolean
				get_current: () => TResult<Ordo.User.Current.Instance | null, Ordo.Rrr<"EPERM">>
				get_by_id: (uid: Ordo.User.UID) => Oath.Instance<Ordo.User.Public.Instance, Ordo.Rrr<"EPERM" | "EINVAL" | "EIO">>
				get_by_handle: (
					handle: Ordo.User.Handle,
				) => Oath.Instance<Ordo.User.Public.Instance, Ordo.Rrr<"EPERM" | "EINVAL" | "EIO">>
				get $(): Zags.Instance<{ version: number }>
			}

			type QueryStatic = {
				Of: (
					check_permission: (permission: Ordo.CreateFunction.QueryPermission) => TResult<void, Ordo.Rrr<"EPERM">>,
				) => Ordo.User.Query
			}
		}

		// TODO improve types
		namespace Content {
			type Instance = ArrayBuffer | ArrayBufferLike | ReadableStream | null

			type PersistenceStrategy = {
				clear: () => Oath.Instance<void, Ordo.Rrr<"EIO">>
				delete: (uid: Ordo.User.UID, fsid: Ordo.Metadata.FSID) => Oath.Instance<void, Ordo.Rrr<"ENOENT" | "EIO">>
				exists: (uid: Ordo.User.UID, fsid: Ordo.Metadata.FSID) => Oath.Instance<boolean, Ordo.Rrr<"EIO">>
				get: (uid: Ordo.User.UID, fsid: Ordo.Metadata.FSID) => Oath.Instance<Ordo.Content.Instance, Ordo.Rrr<"ENOENT" | "EIO">>
				list: () => Oath.Instance<Record<string, any>, Ordo.Rrr<"EIO">>
				put: (
					uid: Ordo.User.UID,
					fsid: Ordo.Metadata.FSID,
					content: Ordo.Content.Instance,
				) => Oath.Instance<void, Ordo.Rrr<"EIO">>
			}

			type RepositoryStatic = {
				Of: (
					auth$: Zags.Instance<{ user: Ordo.User.Current.Instance | null }>,
					local_strategy: Ordo.Content.PersistenceStrategy,
					remote_strategy: Ordo.Content.PersistenceStrategy,
				) => Repository
			}

			type Repository = {
				get: (
					uid: Ordo.User.UID | null,
					fsid: Ordo.Metadata.FSID,
				) => Oath.Instance<Ordo.Content.Instance, Ordo.Rrr<"EIO" | "EACCES" | "EINVAL">>
				get_all: () => Oath.Instance<Record<string, Ordo.Content.Instance>, Ordo.Rrr<"EIO">>
				put: (
					uid: Ordo.User.UID | null,
					fsid: Ordo.Metadata.FSID,
					content: Ordo.Content.Instance,
				) => Oath.Instance<void, Ordo.Rrr<"EINVAL" | "EACCES" | "EIO">>
				remove: (
					uid: Ordo.User.UID | null,
					fsid: Ordo.Metadata.FSID,
				) => Oath.Instance<void, Ordo.Rrr<"EINVAL" | "ENOENT" | "EACCES" | "EIO">>
				get $(): Zags.Instance<{ version: number }>
			}

			type QueryStatic = {
				Of: (
					repository: Ordo.Content.Repository,
					check_query_permission: (permission: Ordo.CreateFunction.QueryPermission) => TResult<void, Ordo.Rrr<"EPERM">>,
				) => Ordo.Content.Query
			}

			type Query = {
				get: (
					uid: Ordo.User.UID,
					fsid: Ordo.Metadata.FSID,
				) => Oath.Instance<Ordo.Content.Instance, Ordo.Rrr<"EPERM" | "EIO" | "EACCES" | "EINVAL" | "ENOENT">>
			}
		}

		namespace Metadata {
			type FSID = `${string}-${string}-${string}-${string}-${string}`
			type Props = Readonly<Record<string, any>>

			type CreateParams<$TProps extends Ordo.Metadata.Props = Ordo.Metadata.Props> = Partial<
				Omit<Ordo.Metadata.DTO<$TProps>, "created_by" | "created_at" | "updated_at" | "updated_by" | "fsid">
			> &
				Pick<Ordo.Metadata.DTO<$TProps>, "name" | "parent">

			type DTO<$TProps extends Ordo.Metadata.Props = Ordo.Metadata.Props> = {
				fsid: Ordo.Metadata.FSID
				name: string
				parent: Ordo.Metadata.FSID | null
				links: Ordo.Metadata.FSID[]
				labels: Ordo.Metadata.Label[]
				type: string
				created_at: number
				created_by: Ordo.User.UID | null
				updated_at: number
				updated_by: Ordo.User.UID | null
				size: number
				props?: $TProps
				is_deleted?: boolean
				checksum?: string
			}

			type Static = {
				Of: <$TProps extends Ordo.Metadata.Props = Ordo.Metadata.Props>(
					params: Ordo.Metadata.CreateParams<$TProps> & { author_id: Ordo.User.UID | null },
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
				has_label: (label: Ordo.Metadata.Label) => boolean
				get_label_index: (label: Ordo.Metadata.Label) => number
				get_type: () => string
				get_created_at: () => Date
				get_created_by: () => Ordo.User.UID | null
				get_updated_at: () => Date
				get_updated_by: () => Ordo.User.UID | null
				get_size: () => number
				get_readable_size: () => string
				get_property: <_TKey extends keyof $TProps>(key: _TKey) => NonNullable<$TProps[_TKey]> | null
				to_dto: () => Ordo.Metadata.DTO<$TProps>
				equals: (other_metadata?: Ordo.Metadata.Instance) => boolean
				is_item_of: (dto: Ordo.Metadata.DTO) => boolean
				is_hidden: () => boolean
				validate: (checksum: string) => boolean
				is_deleted: () => boolean
				is_local_only: () => boolean
			}

			type Validations = TValidations<Ordo.Metadata.DTO> & {
				is_metadata: (x: unknown) => x is Ordo.Metadata.Instance
				is_metadata_dto: (x: unknown) => x is Ordo.Metadata.DTO
				is_label: (x: unknown) => x is Ordo.Metadata.Label
				is_link: (x: unknown) => x is Ordo.Metadata.FSID
				is_prop_key: (x: unknown) => boolean
				are_labels: (x: unknown) => boolean
				are_links: (x: unknown) => boolean
			}

			type Label = { name: string; color: C.LABEL_COLOR }

			type RepositoryStatic = {
				Of: (metadata$: Zags.Instance<{ items: Ordo.Metadata.Instance[] | null }>) => Repository
			}

			type Repository = {
				get: () => TResult<Ordo.Metadata.Instance[], Ordo.Rrr<"EPERM" | "EAGAIN">>
				put: (metadata: Ordo.Metadata.Instance[]) => TResult<void, Ordo.Rrr<"EINVAL">>
				get $(): Zags.Instance<{ version: number }>
			}

			type RepositoryAsyncStatic = {
				Of: (data_host: string, fetch: Ordo.Fetch) => RepositoryAsync
			}

			type RepositoryAsync = {
				get: () => Oath.Instance<Ordo.Metadata.DTO[], Ordo.Rrr<"EIO">>
				put: (metadata: Ordo.Metadata.DTO[]) => Oath.Instance<void, Ordo.Rrr<"EINVAL" | "EIO">>
			}

			type QueryOptions = { show_hidden?: boolean }

			type QueryStatic = {
				Of: (
					repository: Ordo.Metadata.Repository,
					check_query_permission: (permission: Ordo.CreateFunction.QueryPermission) => TResult<void, Ordo.Rrr<"EPERM">>,
				) => Query
			}

			type Query = {
				get $(): Zags.Instance<{ version: number }>

				get: (options?: QueryOptions) => TResult<Ordo.Metadata.Instance[], Ordo.Rrr<"EPERM" | "EAGAIN">>

				get_by_fsid: (
					fsid: FSID,
					options?: QueryOptions,
				) => TResult<Ordo.Metadata.Instance | null, Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL">>

				total: (options?: QueryOptions) => TResult<number, Ordo.Rrr<"EPERM" | "EAGAIN">>

				get_by_name: (
					name: string,
					parent: FSID | null,
					options?: QueryOptions,
				) => TResult<Ordo.Metadata.Instance | null, Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL">>

				get_by_labels: (
					labels: Ordo.Metadata.Label[],
					options?: QueryOptions,
				) => TResult<Ordo.Metadata.Instance[], Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL">>

				has_incoming_links: (
					fsid: FSID,
					options?: QueryOptions,
				) => TResult<boolean, Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL" | "ENOENT">>

				get_incoming_links: (
					fsid: FSID,
					options?: QueryOptions,
				) => TResult<Ordo.Metadata.Instance[], Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL" | "ENOENT">>

				get_outgoing_links: (
					fsid: FSID,
					options?: QueryOptions,
				) => TResult<Ordo.Metadata.Instance[], Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL" | "ENOENT">>

				get_parent: (
					fsid: FSID,
					options?: QueryOptions,
				) => TResult<Ordo.Metadata.Instance | null, Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL" | "ENOENT">>

				get_ancestors: (
					fsid: FSID,
					options?: QueryOptions,
				) => TResult<Ordo.Metadata.Instance[], Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL" | "ENOENT">>

				has_ancestor: (
					fsid: FSID,
					ancestor: FSID,
					options?: QueryOptions,
				) => TResult<boolean, Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL" | "ENOENT">>

				has_child: (
					fsid: FSID,
					child: FSID,
					options?: QueryOptions,
				) => TResult<boolean, Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL" | "ENOENT">>

				has_children: (
					fsid: FSID,
					options?: QueryOptions,
				) => TResult<boolean, Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL" | "ENOENT">>

				get_children: (
					fsid: FSID | null,
					options?: QueryOptions,
				) => TResult<Ordo.Metadata.Instance[], Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL" | "ENOENT">>

				has_descendent: (
					fsid: FSID,
					descendent: FSID,
					options?: QueryOptions,
				) => TResult<boolean, Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL" | "ENOENT">>

				has_descendents: (
					fsid: FSID,
					options?: QueryOptions,
				) => TResult<boolean, Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL" | "ENOENT">>

				get_descendents: (
					fsid: FSID,
					options?: QueryOptions,
					accumulator?: Ordo.Metadata.Instance[],
				) => TResult<Ordo.Metadata.Instance[], Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL" | "ENOENT">>

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
				) => TResult<void, Ordo.Rrr<"EPERM" | "EAGAIN" | "EEXIST" | "EINVAL" | "ENOENT">>

				replace: (value: Ordo.Metadata.Instance) => TResult<void, Ordo.Rrr<"EPERM" | "EAGAIN" | "ENOENT" | "EINVAL">>

				remove: (fsid: Ordo.Metadata.FSID) => TResult<void, Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL" | "ENOENT">>

				append_child: (
					fsid: Ordo.Metadata.FSID,
					child: Ordo.Metadata.FSID,
				) => TResult<void, Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL" | "ENOENT" | "EEXIST" | "ENXIO">>

				add_labels: (
					fsid: Ordo.Metadata.FSID,
					...labels: Ordo.Metadata.Label[]
				) => TResult<void, Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL" | "ENOENT">>

				remove_labels: (
					fsid: Ordo.Metadata.FSID,
					...labels: Ordo.Metadata.Label[]
				) => TResult<void, Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL" | "ENOENT">>

				update_label: (
					old_label: Ordo.Metadata.Label,
					new_label: Ordo.Metadata.Label,
				) => TResult<void, Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL" | "ENOENT">>

				replace_labels: (
					fsid: Ordo.Metadata.FSID,
					labels: Ordo.Metadata.Label[],
				) => TResult<void, Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL" | "ENOENT">>

				set_size: (fsid: Ordo.Metadata.FSID, size: number) => TResult<void, Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL" | "ENOENT">>

				add_links: (
					fsid: Ordo.Metadata.FSID,
					...links: Ordo.Metadata.FSID[]
				) => TResult<void, Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL" | "ENOENT">>

				remove_links: (
					fsid: Ordo.Metadata.FSID,
					...links: Ordo.Metadata.FSID[]
				) => TResult<void, Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL" | "ENOENT">>

				replace_links: (
					fsid: Ordo.Metadata.FSID,
					links: Ordo.Metadata.FSID[],
				) => TResult<void, Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL" | "ENOENT">>

				set_parent: (
					fsid: Ordo.Metadata.FSID,
					parent: Ordo.Metadata.FSID | null,
				) => TResult<void, Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL" | "ENOENT" | "ENXIO" | "EEXIST">>

				set_name: (
					fsid: Ordo.Metadata.FSID,
					name: string,
				) => TResult<void, Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL" | "ENOENT" | "EEXIST">>

				set_property: <$TProps extends Ordo.Metadata.Props, $TKey extends keyof $TProps>(
					fsid: Ordo.Metadata.FSID,
					key: $TKey,
					value: $TProps[$TKey],
				) => TResult<void, Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL" | "ENOENT">>

				remove_property: <$TProps extends Ordo.Metadata.Props, $TKey extends keyof $TProps>(
					fsid: Ordo.Metadata.FSID,
					key: $TKey,
				) => TResult<void, Ordo.Rrr<"EPERM" | "EAGAIN" | "EINVAL" | "ENOENT">>
			}
		}

		namespace Modal {
			type Params = { onunmount?: () => void; render: (div: HTMLDivElement) => void | Promise<void>; size?: MODAL_SIZE }
		}

		namespace Router {
			type OpenExternalParams = { url: string; new_tab?: boolean }

			type Route = {
				params: Record<string, string>
				host: string
				hostname: string
				href: string
				origin: string
				password: string
				pathname: `/${string}`
				port: string
				protocol: `${string}:`
				search: string
				username: string
			}
		}

		namespace Notification {
			type Instance = {
				id: string
				type: C.NOTIFICATION_TYPE
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
				type: C.CONTEXT_MENU_ITEM_TYPE

				on_select: () => void | Promise<void>

				/**
				 * Readable name of the context menu item. Put a translated value here.
				 */
				readable_name: Ordo.I18N.TranslationKey

				/**
				 * Icon to be displayed for the context menu item.
				 */
				render_icon?: (span: HTMLSpanElement) => void | Promise<void>

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
				payload_creator?: (params: Ordo.ContextMenu.Params<any>) => unknown
			}

			/**
			 * Context menu item method parameters.
			 */
			type Params<$TPayload = unknown> = { event: MouseEvent; payload?: $TPayload }

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
			type Instance<$Value = any> = {
				items: Ordo.CommandPalette.Item<$Value>[]
				on_new_item?: (input: string) => Ordo.CommandPalette.Item<$Value>
				is_multiple?: boolean
				on_select: (item: Ordo.CommandPalette.Item<$Value>) => void
				on_deselect?: (item: Ordo.CommandPalette.Item<$Value>) => void
				pinned_items?: Ordo.CommandPalette.Item<$Value>[]
				max_items?: number
			}

			type Id = string | number

			type RenderIcon = (span: HTMLSpanElement) => void | Promise<void>

			type RenderCustomItemFooter = (div: HTMLDivElement) => void | Promise<void>

			type RenderCustomItemInfo = (div: HTMLDivElement) => void | Promise<void>

			/**
			 * Command palette item.
			 */
			type Item<$Value = any> = {
				id: Ordo.CommandPalette.Id
				/**
				 * Readable name of the command palette item. Put a translation key here, if you use i18n.
				 */
				readable_name: string

				value: $Value

				/**
				 * Icon to be displayed for the context menu item.
				 *
				 * @optional
				 */
				render_icon?: Ordo.CommandPalette.RenderIcon
				render_custom_footer?: Ordo.CommandPalette.RenderCustomItemFooter
				render_custom_info?: Ordo.CommandPalette.RenderCustomItemFooter

				/**
				 * Keyboard hotkey for the context menu item. It only works while the context menu is
				 * opened.
				 *
				 * @optional
				 */
				hotkey?: string

				description?: string

				type?: C.COMMAND_PALETTE_ITEM_TYPE
			}
		}
	}
}
