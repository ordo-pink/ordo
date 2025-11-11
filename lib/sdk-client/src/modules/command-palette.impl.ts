/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

export namespace CONSTANTS {
	export const FUZZY_CHECK_RATIO = 0.7

	export enum ITEM_TYPE {
		PAGE_OPENER,
		MODAL_OPENER,
		FILE_CREATOR,
		AUTOMATION_ACTION,
		COMMON_ACTION,
		INFORMATION,
		DESTRUCTIVE_ACTION,
		length,
	}

	export enum SECTION {
		ITEMS,
		PINNED_ITEMS,
	}
}

declare global {
	interface cmd {
		command_palette: {
			add: { args: OrdoClient.CommandPalette.Item<() => void> }
			hide: { args: void }
			remove: { args: string | number }
			show: { args: OrdoClient.CommandPalette.Instance | undefined }
			toggle: { args: void }
		}
	}

	namespace OrdoClient.CommandPalette {
		export type Id = string | number

		export type Item<$Value = any> = {
			id: Id
			/** Readable name of the command palette item. Put a translation key here, if you use i18n. */
			readable_name: OrdoClient.Translations.Key

			value: $Value

			/** Icon to be displayed for the menu item. */
			render_icon?: RenderIcon
			render_custom_footer?: RenderCustomItemFooter
			render_custom_info?: RenderCustomItemFooter

			/** Hotkey for the menu item to be triggered. It will work no matter if the command palette is opened or not. */
			hotkey?: string

			description?: OrdoClient.Translations.Key

			type?: CONSTANTS.ITEM_TYPE
		}

		export type Instance<$Value = any> = {
			items: Item<$Value>[]
			on_new_item?: (input: string) => Item<$Value>
			is_multiple?: boolean
			on_select: (item: Item<$Value>) => void
			on_deselect?: (item: Item<$Value>) => void
			pinned_items?: Item<$Value>[]
			max_items?: number
		}

		export type RenderIcon = (span: HTMLSpanElement) => void | Promise<void>

		export type RenderCustomItemFooter = (div: HTMLDivElement) => void | Promise<void>

		export type RenderCustomItemInfo = (div: HTMLDivElement) => void | Promise<void>
	}
}
