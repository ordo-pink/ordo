/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

export namespace CONSTANTS {
	/**
	 * Context menu item type. This impacts two things:
	 *
	 * 1. Grouping items in the context menu.
	 * 2. Given type can be hidden when showing context menu.
	 */
	export enum ITEM_TYPE {
		CREATE,
		READ,
		UPDATE,
		DELETE,
		length,
	}
}

declare global {
	namespace OrdoClient.ContextMenu {
		/**
		 * Context menu item.
		 */
		export type Item = {
			/**
			 * Check whether the item needs to be shown.
			 */
			should_show: (params: Params) => boolean

			/**
			 * @see ItemType
			 */
			type: CONSTANTS.ITEM_TYPE

			on_select: () => void | Promise<void>

			/**
			 * Readable name of the context menu item. Put a translated value here.
			 */
			readable_name: OrdoClient.Translations.Key

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
			should_be_disabled?: (params: Params) => boolean

			/**
			 * This function allows you to override the incoming payload that will be passed to the command
			 * invoked by the context menu item.
			 *
			 * @optional
			 * @default () => payload
			 */
			payload_creator?: (params: Params<any>) => unknown
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
			structure: Item[]
		}
	}
}
