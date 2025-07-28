/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { CORE, Core } from "@ordo-pink/sdk-core"
import type { Hunt } from "@ordo-pink/hunt"
import type { I18n } from "@ordo-pink/i18n"
import type { Oath } from "@ordo-pink/oath"
import type { Result } from "@ordo-pink/result"
import type { RoutaryBrowser } from "@ordo-pink/routary-browser"
import type { Zags } from "@ordo-pink/zags"

import type { COMMAND_PALETTE, CONTEXT_MENU, MODAL, NOTIFICATION } from "./sdk-client.constants"

export namespace ClientRrr {
	export type Instance<$Type extends Core.Rrr.Type = Core.Rrr.Type> = {
		type: (typeof CORE.RRR.TYPE)[$Type]
		message: ClientSDK.Translations.Key
		debug: any[]
	}

	export type Create<$Type extends Core.Rrr.Type> = (
		message: ClientSDK.Translations.Key,
		...debug: any
	) => ClientRrr.Instance<$Type>

	export type CreateType = <$Type extends Core.Rrr.Type>(type: $Type) => ClientRrr.Create<$Type>
}

export namespace ClientSDK {
	export type CreateHotkeyFromEvent = (event: KeyboardEvent, is_darwin: boolean) => string

	export type Fetch = (input: string | URL | Request, init?: RequestInit) => Promise<Response>

	export type Preys = Pick<cmd, keyof cmd>

	export type Hunter = Hunt.Instance<ClientSDK.Preys>

	export type GunFor<$Prey extends keyof Hunt.Pouch.ToPreys<ClientSDK.Preys>> = Hunt.GunFor<
		Hunt.Pouch.ToPreys<ClientSDK.Preys>,
		$Prey
	>

	// Press it, you
	export namespace F {
		// TODO permissions for data and user queries
		export type Blessing = Exclude<keyof ClientSDK.F.State, "hunter"> | `user_query.${keyof ClientSDK.User.Query.Instance}`

		export type HuntingTicket = keyof Hunt.Pouch.ToPreys<ClientSDK.Preys>

		export type Permissions = {
			queries: ClientSDK.F.Blessing[]
			commands: ClientSDK.F.HuntingTicket[]
		}

		export type State = {
			activities$: Zags.Instance<ClientSDK.Activity.State>
			auth$: Zags.Instance<ClientSDK.User.State>
			fetch: ClientSDK.Fetch
			hosts: Core.Hosts
			hunter: Hunter
			i18n$: I18n.Zags<ClientSDK.Translations.Keys>
			logger: Core.Logger
			rotor$: RoutaryBrowser.Zags
		}

		export type Create = (
			name: string,
			permissions: Permissions,
			callback: (state: State) => void | Promise<void> | (() => void | Promise<void>) | Promise<() => void | Promise<void>>,
		) => (state: State) => Promise<() => void | Promise<void>>
	}

	export namespace Activity {
		export type State = {
			items: ClientSDK.Activity.Instance[]
			current: ClientSDK.Activity.Instance | null
		}

		export type Route = `/${string}`

		export type OnUnmountArgs = {
			icon?: HTMLSpanElement
			sidebar?: HTMLDivElement
			workspace?: HTMLDivElement
		}

		export type OnUnmount = (args: ClientSDK.Activity.OnUnmountArgs) => void

		export type RenderIcon = (span: HTMLSpanElement) => void | Promise<void>

		export type RenderSidebar = (div: HTMLDivElement) => void | Promise<void>

		export type RenderWorkspace = (div: HTMLDivElement) => void | Promise<void>

		export type ID = string

		export type Instance = {
			id: ClientSDK.Activity.ID
			readable_name: ClientSDK.Translations.Key
			routes: ClientSDK.Activity.Route[]
			start_route?: ClientSDK.Activity.Route
			onunmount?: ClientSDK.Activity.OnUnmount
			render_icon?: ClientSDK.Activity.RenderIcon
			render_sidebar?: ClientSDK.Activity.RenderSidebar
			render_workspace?: ClientSDK.Activity.RenderWorkspace
		}
	}

	export namespace FileAssociation {
		export type RenderFn = (params: ClientSDK.FileAssociation.RenderParams) => void | Promise<void>

		export type RenderToStringFn = (params: ClientSDK.FileAssociation.RenderParams) => string | Promise<string>

		export type RenderIconFn = (span: HTMLSpanElement) => void | Promise<void>

		export type Type = {
			description: ClientSDK.Translations.Key
			name: string
			readable_name: ClientSDK.Translations.Key
		}

		// TODO Support for marking files as remote-only
		export type Instance = {
			name: string
			render_icon?: ClientSDK.FileAssociation.RenderIconFn
			content_to_string?: {
				render?: ClientSDK.FileAssociation.RenderToStringFn
				styles?: string[]
			}
			render: RenderFn
			types: ClientSDK.FileAssociation.Type[]
		}

		export type RenderParams = {
			div: HTMLDivElement
			is_editable: boolean
			is_embedded: boolean
			// data: Data.Instance
		}
	}

	export namespace Translations {
		export type Keys = Pick<t, keyof t>
		export type Key = I18n.DefinitionToTranslationKeys<ClientSDK.Translations.Keys>
		export type Values = Record<I18n.DefinitionToTranslationKeys<ClientSDK.Translations.Keys>, string>

		type HasPrefix<T extends string, P extends string> = T extends `${P}${string}` ? T : never

		export type PickValues<$Prefix extends string> = {
			[_Key in keyof ClientSDK.Translations.Values as HasPrefix<_Key, $Prefix>]: ClientSDK.Translations.Values[_Key]
		}
	}

	export namespace Modal {
		export type Params = { onunmount?: () => void; render: (div: HTMLDivElement) => void | Promise<void>; size?: MODAL.SIZE }
	}

	export namespace CommandPalette {
		export namespace Item {
			export type ID = string | number

			/** Command palette item. */
			export type Instance<$Value = any> = {
				id: ClientSDK.CommandPalette.Item.ID
				/** Readable name of the command palette item. Put a translation key here, if you use i18n. */
				readable_name: ClientSDK.Translations.Key

				value: $Value

				/** Icon to be displayed for the menu item. */
				render_icon?: ClientSDK.CommandPalette.RenderIcon
				render_custom_footer?: ClientSDK.CommandPalette.RenderCustomItemFooter
				render_custom_info?: ClientSDK.CommandPalette.RenderCustomItemFooter

				/** Hotkey for the menu item to be triggered. It will work no matter if the command palette is opened or not. */
				hotkey?: string

				description?: ClientSDK.Translations.Key

				type?: COMMAND_PALETTE.ITEM_TYPE
			}
		}

		export type Instance<$Value = any> = {
			items: ClientSDK.CommandPalette.Item.Instance<$Value>[]
			on_new_item?: (input: string) => ClientSDK.CommandPalette.Item.Instance<$Value>
			is_multiple?: boolean
			on_select: (item: ClientSDK.CommandPalette.Item.Instance<$Value>) => void
			on_deselect?: (item: ClientSDK.CommandPalette.Item.Instance<$Value>) => void
			pinned_items?: ClientSDK.CommandPalette.Item.Instance<$Value>[]
			max_items?: number
		}

		export type RenderIcon = (span: HTMLSpanElement) => void | Promise<void>

		export type RenderCustomItemFooter = (div: HTMLDivElement) => void | Promise<void>

		export type RenderCustomItemInfo = (div: HTMLDivElement) => void | Promise<void>
	}

	export namespace Notification {
		export type ShowArgs = Core.Prettify<
			Partial<ClientSDK.Notification.Instance> & Required<Pick<ClientSDK.Notification.Instance, "message">>
		>

		export type Instance = {
			id: Core.Uuid.Instance
			type?: NOTIFICATION.TYPE
			title?: ClientSDK.Translations.Key
			message: ClientSDK.Translations.Key
			render_icon?: (div: HTMLDivElement) => void | Promise<void>
			duration?: number
			on_click?: () => void
			// persist?: boolean
			// payload?: T
			// action?: (id: string, payload: T) => void
			// action_text?: Client.Translations.Key
		}
	}

	export namespace ContextMenu {
		export namespace Item {
			/**
			 * Context menu item.
			 */
			export type Instance = {
				/**
				 * Check whether the item needs to be shown.
				 */
				should_show: (params: ClientSDK.ContextMenu.Params) => boolean

				/**
				 * @see ItemType
				 */
				type: CONTEXT_MENU.ITEM_TYPE

				on_select: () => void | Promise<void>

				/**
				 * Readable name of the context menu item. Put a translated value here.
				 */
				readable_name: ClientSDK.Translations.Key

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
				should_be_disabled?: (params: ClientSDK.ContextMenu.Params) => boolean

				/**
				 * This function allows you to override the incoming payload that will be passed to the command
				 * invoked by the context menu item.
				 *
				 * @optional
				 * @default () => payload
				 */
				payload_creator?: (params: ClientSDK.ContextMenu.Params<any>) => unknown
			}
		}

		/**
		 * Context menu item method parameters.
		 */
		export type Params<$TPayload = unknown> = { event: MouseEvent; payload?: $TPayload }

		/**
		 * Context menu.
		 */
		export type Instance = {
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
			structure: ClientSDK.ContextMenu.Item.Instance[]
		}
	}

	export namespace User {
		export type State = { user?: Core.User.Instance }

		export namespace Query {
			export type DataInterface = {
				Instance: {}
				Plain: { current: Core.User.Instance | null }
				Static: {}
				Validations: {}
			}

			export type CheckPermissions = (permission: F.Blessing) => Result.Instance<void, Core.Rrr.Instance<"EPERM">>

			export type Instance = {
				is_authenticated: () => boolean
				get_current: () => Core.User.Instance | null
				get_by_id: (id: Core.Uuid.Instance) => Oath.Instance<Core.User.Instance, Core.Rrr.Instance<"EPERM" | "EINVAL" | "EIO">>
				get_by_handle: (
					handle: Core.User.Ref,
				) => Oath.Instance<Core.User.Instance, Core.Rrr.Instance<"EPERM" | "EINVAL" | "EIO">>
				get $(): Zags.Instance<{ version: number }>
			}

			export type Static = {
				create: (check_permissions: ClientSDK.User.Query.CheckPermissions) => Instance
			}
		}
	}
}

/*
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
 *
namespace Achievement {
	/**
	 * Achievement subscriber is designed to track user progress in terms of the achievement
	 * as well as update/grant the achievement based of what the user has achieved.
	 *
	namespace Subscriber {
		/**
		 * Subscribe function params.
		 *
		 * @see {@link Ordo.Achievement.Subscriber.Fn}
		 *
		type Params = {
			/**
			 * Update the achievement content. Useful for multistep achievements. Accepts a callback
			 * that encloses previous achievement {@link DTO} state.
			 *
			update: (f: (prev_state: Ordo.Achievement.DTO) => Ordo.Achievement.DTO) => void

			/**
			 * Grant the achievement to the user. Should be called if the user has completed of the
			 * required criteria.
			 *
			grant: () => void
		}

		/**
		 * Subscribe function is called once the achievement is registerred. Inside
		 * the function, any subscriptions to commands (or other means of tracking user
		 * progress) may be added.
		 *
		 * @see {@link Ordo.Achievement.Subscriber.Params}
		 *
		type Fn = (params: Ordo.Achievement.Subscriber.Params) => void
	}

	/**
	 * Transferrable achievement object.
	 *
	type DTO = {
		/**
		 * Achievement identifier.
		 *
		 * @unique Subsequent achievements with the same `id` are not registerred (first in).
		 *
		id: string

		/**
		 * Translation key of the title of the achievement.
		 *
		 * @see {@link Ordo.I18N.TranslationKey}
		 *
		title: Ordo.I18N.TranslationKey

		/**
		 * URL of the achievement icon. Should be at least 200x200px.
		 *
		image: string

		/**
		 * Translation key of the description of the achievement. The description should give a
		 * hint on how to obtain the achievement.
		 *
		 * @see {@link Ordo.I18N.TranslationKey}
		 *
		description: Ordo.I18N.TranslationKey

		/**
		 * Achievement `id` of the previous achievement in an achievement stack.
		 *
		 * @see {@link Ordo.Achievement}
		 *
		previous?: string

		/**
		 * Achievement completion date. `null` means the achievement was not completed.
		 *
		completed_at: Date | null

		/**
		 * Achievement category.
		 *
		 * @see {@link AchievementCategory}
		 *
		category: C.ACHIEVEMENT_CATEGORY
	}

	/**
	 * Achievement object being registerred in Ordo.
	 *
	type Instance = {
		/**
		 * Transferrable achievement object.
		 *
		 * @see {@link DTO}
		 *
		descriptor: DTO

		/**
		 * Achievement progress subscriber. Registerred once when the achievement itself
		 * is registerred.
		 *
		 * @see {@link Ordo.Achievement.Subscriber}
		 *
		subscribe: Ordo.Achievement.Subscriber.Fn
	}
}
*/
