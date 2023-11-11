// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { IconType } from "react-icons"
import type { ComponentType, MouseEvent } from "react"
import type { Nullable, Thunk, UUIDv4, Unary } from "@ordo-pink/tau"
import type { FSID, PlainData } from "@ordo-pink/data"
import type { Observable } from "rxjs"
import type { Logger } from "@ordo-pink/logger"
import type { ComponentSpace } from "./constants/component-space.constants"
import type { Transformer } from "@lexical/markdown"
import type { LexicalNode } from "lexical"

export namespace Functions {
	export type CreateFunctionParams = {
		commands: Commands.Commands
		data$: Nullable<Observable<PlainData[]>>
	}
	export type CreateFunctionFn = Unary<Functions.CreateFunctionParams, void | Promise<void>>
}

export namespace cmd {
	export namespace user {
		export type refreshInfo = { name: "user.refresh" }
		export type signOut = { name: "user.sign-out" }
	}

	export namespace notification {
		export type show = { name: "notification.show"; payload: Notification.Item }
		export type hide = { name: "notification.hide"; payload: string }
	}

	export namespace activities {
		export type add = { name: "activities.add"; payload: Extensions.Activity }
		export type remove = { name: "activities.remove"; payload: string }
		export type setCurrent = { name: "activities.set-current"; payload: Extensions.Activity }
	}

	export namespace fileAssociations {
		export type add = { name: "file-associations.add"; payload: Extensions.FileAssociation }
		export type remove = { name: "file-associations.remove"; payload: string }
		export type setCurrent = {
			name: "file-associations.set-current"
			payload: Extensions.FileAssociation
		}
	}

	export namespace data {
		export type refreshRoot = { name: "data.refresh-root" }
		export type getFileContent = { name: "data.get-content"; payload: { fsid: FSID } }
		export type showUploadModal = { name: "data.show-upload-modal"; payload: Nullable<PlainData> }
		export type showCreateModal = { name: "data.show-create-modal"; payload: Nullable<PlainData> }
		export type showRemoveModal = { name: "data.show-remove-modal"; payload: PlainData }
		export type showRenameModal = { name: "data.show-rename-modal"; payload: PlainData }
		export type showEditLabelsPalette = {
			name: "data.show-edit-labels-palette"
			payload: PlainData
		}
		export type showEditLinksPalette = {
			name: "data.show-edit-links-palette"
			payload: PlainData
		}

		export type setContent = {
			name: "data.set-content"
			payload: { fsid: FSID; content: string | ArrayBuffer }
		}
		export type uploadContent = {
			name: "data.upload-content"
			payload: { name: string; parent: Nullable<FSID>; content: string | ArrayBuffer }
		}
		export type create = {
			name: "data.create"
			payload: { name: string; parent: Nullable<FSID>; labels?: string[] }
		}
		export type remove = { name: "data.remove"; payload: PlainData }
		export type move = { name: "data.move"; payload: { fsid: FSID; parent: Nullable<FSID> } }
		export type rename = { name: "data.rename"; payload: { fsid: FSID; name: string } }
		export type addLabel = { name: "data.add-label"; payload: { item: PlainData; label: string } }
		export type removeLabel = {
			name: "data.remove-label"
			payload: { item: PlainData; label: string }
		}

		export type addLink = { name: "data.add-link"; payload: { item: PlainData; link: FSID } }
		export type removeLink = {
			name: "data.remove-link"
			payload: { item: PlainData; link: FSID }
		}
	}

	export namespace ctxMenu {
		export type add = { name: "context-menu.add"; payload: CtxMenu.Item }
		export type remove = { name: "context-menu.remove"; payload: string }
		export type show = { name: "context-menu.show"; payload: CtxMenu.ShowOptions }
		export type hide = { name: "context-menu.hide"; payload: void }
	}

	export namespace commandPalette {
		export type add = { name: "command-palette.add"; payload: CommandPalette.Item }
		export type remove = { name: "command-palette.remove"; payload: string }
		export type show = {
			name: "command-palette.show"
			payload: {
				items: CommandPalette.Item[]
				onNewItem?: (newItem: string) => any
				multiple?: boolean
				pinnedItems?: CommandPalette.Item[]
			}
		}
		export type hide = { name: "command-palette.hide"; payload: void }
	}

	export namespace sidebar {
		export type enable = { name: "sidebar.enable" }
		export type disable = { name: "sidebar.disable" }
		export type setSize = { name: "sidebar.set-size"; payload: [number, number] }
		export type show = { name: "sidebar.show"; payload?: [number, number] }
		export type hide = { name: "sidebar.hide" }
		export type toggle = { name: "sidebar.toggle" }
	}

	export namespace router {
		export type navigate = { name: "router.navigate"; payload: Router.NavigateParams | string }
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

export namespace Extensions {
	export type Activity = {
		name: string
		routes: string[]
		Component: ComponentType<ComponentProps>
		Sidebar?: ComponentType
		background?: boolean
	}

	export type ComponentProps = {
		commands: Commands.Commands
		space: ComponentSpace
	}

	export type FileExtension = `.${string}`

	export type FileAssociation = {
		name: string
		fileExtensions: FileExtension[] | "*"
		Component: ComponentType<ComponentProps>
	}

	export type EditorPlugin = {
		name: string
		Plugin?: ComponentType
		transformer?: Transformer
		nodes?: (typeof LexicalNode)[]
	}
}

export namespace Commands {
	/**
	 * Context provided to command handler.
	 */
	export type Context<P = any> = { logger: Logger; payload: P }

	/**
	 * Command handler.
	 */
	export type Handler<P> = Unary<Commands.Context<P>, any>

	export type Commands = {
		/**
		 * Append a listener to a given command.
		 */
		on: <
			T extends { name: `${string}.${string}`; payload?: any } = {
				name: `${string}.${string}`
				payload: any
			},
		>(
			name: T extends { name: infer U; payload?: any } ? U : never,
			handler: Commands.Handler<T extends { name: any; payload?: infer U } ? U : never>,
		) => any

		/**
		 * Remove given listener for a given command. Make sure you provide a reference to the same
		 * function as you did when calling `on`.
		 */
		off: <
			T extends { name: `${string}.${string}`; payload?: any } = {
				name: `${string}.${string}`
				payload: any
			},
		>(
			name: T extends { name: infer U; payload?: any } ? U : never,
			handler: Commands.Handler<T extends { name: any; payload?: infer U } ? U : never>,
		) => any

		/**
		 * Emit given command with given payload.
		 */
		emit: <
			T extends { name: `${string}.${string}`; payload?: any } = {
				name: `${string}.${string}`
				payload?: any
			},
		>(
			name: T extends { name: infer U; payload?: any } ? U : never,
			payload?: T extends { name: any; payload: infer U } ? U : never,
		) => any
		/**
		 * Prepend listener to a given command.
		 */
		before: <
			T extends { name: `${string}.${string}`; payload: any } = {
				name: `${string}.${string}`
				payload: any
			},
		>(
			name: T extends { name: infer U; payload: any } ? U : never,
			handler: Commands.Handler<T extends { name: any; payload: infer U } ? U : never>,
		) => any
	}
}

export namespace User {
	export type PublicUser = {
		email: string
		createdAt: Date
		subscription: string
		handle?: string
		firstName?: string
		lastName?: string
	}

	export type User = User.PublicUser & {
		id: UUIDv4
		emailConfirmed: boolean
		fileLimit: number
		maxUploadSize: number
	}

	export type InternalUser = User.User & {
		password: string
	}
}

export namespace Notification {
	export type Type = "success" | "rrr" | "info" | "warn" | "question" | "default"

	export type RegisterredItem<T = null> = Notification.Item & { id: string }

	export type Item<T = null> = {
		type: Type
		persist?: boolean
		title?: string
		message: string
		payload?: T
		duration?: number
		action?: (id: string, payload: T) => any
		actionText?: string
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

export namespace CtxMenu {
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
		cmd: `${string}.${string}` // TODO: Move to Commands

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
