// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

// deno-lint-ignore-file no-namespace no-explicit-any

import type { IconType } from "react-icons"
import type { ComponentType, MouseEvent } from "react"
import type { Thunk, Unary } from "@ordo-pink/tau/mod"

export namespace cmd {
	export namespace contextMenu {
		export type add = { name: "context-menu.add"; payload: ContextMenu.Item }
		export type remove = { name: "context-menu.remove"; payload: string }
		export type show = { name: "context-menu.show"; payload: ContextMenu.ShowOptions }
		export type hide = { name: "context-menu.hide"; payload: void }
	}

	export namespace commandPalette {
		export type add = { name: "command-palette.add"; payload: CommandPalette.Item }
		export type remove = { name: "command-palette.remove"; payload: string }
		export type show = { name: "command-palette.show"; payload: CommandPalette.Item[] }
		export type hide = { name: "command-palette.hide"; payload: void }
	}

	export namespace sidebar {
		export type enable = { name: "sidebar.enable" }
		export type disable = { name: "sidebar.disable" }
		export type setSize = { name: "sidebar.set-size"; payload?: [number, number] }
		export type show = { name: "sidebar.show"; payload?: [number, number] }
		export type hide = { name: "sidebar.hide" }
		export type toggle = { name: "sidebar.toggle" }
	}

	export namespace router {
		export type navigate = { name: "router.navigate"; payload: Router.NavigateParams | string }
		export type add = { name: "router.add"; payload: string | string[] }
		export type openExternal = {
			name: "router.open-external"
			payload: Router.OpenExternalParams
		}
	}

	export namespace modal {
		export type show = {
			name: "modal.show"
			payload: {
				Component: ComponentType
				options?: Modal.ShowOptions
			}
		}
		export type hide = { name: "modal.hide" }
	}
}

export namespace Router {
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

	export type OpenExternalParams = { url: string; newTab?: boolean }

	export type Route<Params extends Record<string, string> = Record<string, string>, Data = null> = {
		params: Params
		data: Data
		hash: string
		hashRouting: boolean
		search: string
		path: string
		route: string
	}
}

export namespace Modal {
	/**
	 * Options for showing the modal.
	 */
	export type ShowOptions = {
		/**
		 * Show close button.
		 *
		 * @optional
		 * @default true
		 */
		showCloseButton?: boolean

		/**
		 * Function to run before the modal is hidden.
		 *
		 * @optional
		 * @default () => void 0
		 */
		onHide?: Thunk<void>
	}
}

export namespace ContextMenu {
	/**
	 * Context menu item.
	 */
	export type Item<T = any> = {
		/**
		 * Check whether the item needs to be shown.
		 */
		shouldShow: ItemMethod<T, boolean>

		/**
		 * @see ItemType
		 */
		type: ItemType

		/**
		 * Name of the command to be invoked when the context menu item is used.
		 */
		commandName: `${string}.${string}` // TODO: Move to Commands

		/**
		 * Readable name of the context menu item. Put a translated value here.
		 */
		readableName: string

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
		shouldBeDisabled?: ItemMethod<T, boolean>

		/**
		 * This function allows you to override the incoming payload that will be passed to the command
		 * invoked by the context menu item.
		 *
		 * @optional
		 * @default () => payload
		 */
		payloadCreator?: ItemMethod<T>
	}

	/**
	 * Show context menu item parameters.
	 */
	export type ShowOptions<T = any> = {
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
		hideCreateItems?: boolean

		/**
		 * Avoid showing read items.
		 * @optional
		 * @default false
		 */
		hideReadItems?: boolean

		/**
		 * Avoid showing update items.
		 * @optional
		 * @default false
		 */
		hideUpdateItems?: boolean

		/**
		 * Avoid showing delete items.
		 * @optional
		 * @default false
		 */
		hideDeleteItems?: boolean
	}

	/**
	 * Context menu item method parameters.
	 */
	export type ItemMethodParams<T = any> = { event: MouseEvent; payload?: T }

	/**
	 * Context menu item method descriptor.
	 */
	export type ItemMethod<T = any, Result = any> = Unary<ItemMethodParams<T>, Result>

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

export namespace CommandPalette {
	/**
	 * Command palette item.
	 */
	export type Item = {
		/**
		 * ID of the command to be invoked when the command palette item is used.
		 */
		id: string

		/**
		 * Readable name of the command palette item. Put a translated value here.
		 */
		readableName: string

		/**
		 * Action to be executed when command palette item is used.
		 */
		onSelect: Thunk<void>

		/**
		 * Icon to be displayed for the context menu item.
		 *
		 * @optional
		 */
		Icon?: IconType

		/**
		 * Keyboard accelerator for the context menu item. It only works while the context menu is
		 * opened.
		 *
		 * @optional
		 */
		accelerator?: string
	}
}
