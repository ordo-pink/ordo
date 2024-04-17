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

import type { ComponentType, LazyExoticComponent, MouseEvent } from "react"
import type { IconType } from "react-icons"

import type { FSID, PlainData } from "@ordo-pink/data"
import type { JTI, SUB } from "@ordo-pink/wjwt"
import type { UUIDv4 } from "@ordo-pink/tau"

import type { BackgroundTaskStatus } from "./constants"

declare global {
	module Routes {
		type SuccessResponse<T> = { success: true; result: T }
		type ErrorResponse = { success: false; error: string }
		type TokenResult = {
			sub: SUB
			jti: JTI
			expires: Date
			accessToken: string
			fileLimit: User.User["fileLimit"]
			subscription: User.User["subscription"]
			maxUploadSize: User.User["maxUploadSize"]
		}

		module ID {
			module ChangeAccountInfo {
				type RequestBody = { firstName?: string; lastName?: string }
				type Result = User.User
			}

			module ChangeEmail {
				type RequestBody = { oldEmail?: string; newEmail?: string; userID?: SUB }
				type Result = User.User
			}

			module ChangePassword {
				type RequestBody = { oldPassword?: string; newPassword?: string }
				type Result = TokenResult
			}

			module ConfirmEmail {
				type RequestBody = { email?: string; code?: string }
				type Result = User.User
			}

			module GetAccount {
				type RequestBody = never
				type Result = User.User
			}

			module GetUserInfoByEmail {
				type RequestBody = never
				type RequestParams = { email?: string }
				type Result = User.PublicUser
			}

			module GetUserInfoByID {
				type RequestBody = never
				type RequestParams = { id?: string }
				type Result = User.PublicUser
			}

			module RefreshToken {
				type RequestBody = never
				type Result = TokenResult
			}

			module RequestEmailChange {
				type RequestBody = { oldEmail?: string; newEmail?: string }
				type Result = User.PublicUser
			}

			module SignIn {
				type RequestBody = { email?: string; password?: string }
				type Result = TokenResult
			}

			module SignUp {
				type RequestBody = { email?: string; password?: string }
				type Result = TokenResult
			}

			module VerifyToken {
				type RequestBody = never
				type Result = { valid: false } | { valid: true; token: string }
			}
		}
	}

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

	module cmd {
		module application {
			type setTitle = { name: "application.set-title"; payload: string }
		}

		module background {
			type setStatus = { name: "background-task.set-status"; payload: BackgroundTaskStatus }
			type startSaving = { name: "background-task.start-saving" }
			type startLoading = { name: "background-task.start-loading" }
			type resetStatus = { name: "background-task.reset-status" }
		}

		module extensionState {
			type update<T extends Record<string, unknown> = Record<string, unknown>> = {
				name: "extension-state.update"
				payload: { name: string; payload: T }
			}
		}

		module achievements {
			type add = { name: "achievements.add"; payload: Achievements.Achievement }
		}

		module user {
			type refreshInfo = { name: "user.refresh" }
			type signOut = { name: "user.sign-out" }
			type goToAccount = { name: "user.go-to-account" }
		}

		module notification {
			type show = { name: "notification.show"; payload: Client.Notification.ShowNotificationParams }
			type hide = { name: "notification.hide"; payload: string }
		}

		module activities {
			type add = { name: "activities.add"; payload: Extensions.Activity }
			type remove = { name: "activities.remove"; payload: string }
		}

		module fileAssociations {
			type add = { name: "file-associations.add"; payload: Extensions.FileAssociation }
			type remove = { name: "file-associations.remove"; payload: string }
			type setCurrent = {
				name: "file-associations.set-current"
				payload: Extensions.FileAssociation
			}
		}

		module data {
			type refreshRoot = { name: "data.refresh-root" }
			type getContent = { name: "data.get-content"; payload: FSID }
			type dropContent = { name: "data.drop-content"; payload: FSID }
			type showUploadModal = { name: "data.show-upload-modal"; payload: PlainData | null }
			type showCreateModal = { name: "data.show-create-modal"; payload: PlainData | null }
			type showRemoveModal = { name: "data.show-remove-modal"; payload: PlainData }
			type showRenameModal = { name: "data.show-rename-modal"; payload: PlainData }
			type showEditLabelsPalette = {
				name: "data.show-edit-labels-palette"
				payload: PlainData
			}
			type showEditLinksPalette = {
				name: "data.show-edit-links-palette"
				payload: PlainData
			}

			type setContent = {
				name: "data.set-content"
				payload: { fsid: FSID; content: string | ArrayBuffer; contentType?: string }
			}
			type uploadContent = {
				name: "data.upload-content"
				payload: { name: string; parent: FSID | null; content: string | ArrayBuffer }
			}
			type create = {
				name: "data.create"
				payload: { name: string; parent: FSID | null; labels?: string[]; contentType?: string }
			}
			type remove = { name: "data.remove"; payload: PlainData }
			type move = { name: "data.move"; payload: { fsid: FSID; parent: FSID | null } }
			type rename = { name: "data.rename"; payload: { fsid: FSID; name: string } }
			type addLabel = {
				name: "data.add-label"
				payload: { item: PlainData; label: string | string[] }
			}
			type removeLabel = {
				name: "data.remove-label"
				payload: { item: PlainData; label: string | string[] }
			}

			type addLink = { name: "data.add-link"; payload: { item: PlainData; link: FSID } }
			type removeLink = {
				name: "data.remove-link"
				payload: { item: PlainData; link: FSID }
			}
		}

		module ctxMenu {
			type add = { name: "context-menu.add"; payload: Client.CtxMenu.Item }
			type remove = { name: "context-menu.remove"; payload: string }
			type show = { name: "context-menu.show"; payload: Client.CtxMenu.ShowOptions }
			type hide = { name: "context-menu.hide"; payload: void }
		}

		module commandPalette {
			type add = { name: "command-palette.add"; payload: Client.CommandPalette.Item }
			type remove = { name: "command-palette.remove"; payload: string }
			type show = {
				name: "command-palette.show"
				payload: {
					items: Client.CommandPalette.Item[]
					onNewItem?: (newItem: string) => unknown
					multiple?: boolean
					pinnedItems?: Client.CommandPalette.Item[]
				}
			}
			type hide = { name: "command-palette.hide"; payload: void }
		}

		module sidebar {
			type enable = { name: "sidebar.enable" }
			type disable = { name: "sidebar.disable" }
			type setSize = { name: "sidebar.set-size"; payload: [number, number] }
			type show = { name: "sidebar.show"; payload?: [number, number] }
			type hide = { name: "sidebar.hide" }
			type toggle = { name: "sidebar.toggle" }
		}

		module router {
			type navigate = { name: "router.navigate"; payload: Client.Router.NavigateParams | string }
			type openExternal = {
				name: "router.open-external"
				payload: Client.Router.OpenExternalParams
			}
		}

		module modal {
			type show = {
				name: "modal.show"
				payload: {
					Component: ComponentType
					options?: Client.Modal.ShowOptions
				}
			}
			type hide = { name: "modal.hide" }
		}
	}

	module Extensions {
		type Activity = {
			name: string
			routes: string[]
			Component: ComponentType | LazyExoticComponent<ComponentType>
			Sidebar?: ComponentType
			widgets?: ComponentType[]
			Icon?: ComponentType | IconType
			background?: boolean
		}

		type FileExtension = `.${string}`

		type FileAssociation = {
			name: string
			fileExtensions: FileExtension[] | "*"
			Component: ComponentType
		}
	}

	module User {
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

		export type PrivateUser = User.User & {
			code?: string
		}

		export type InternalUser = User.PrivateUser & {
			password: string
		}
	}

	module Client {
		module Commands {
			type CommandName = `${string}.${string}`

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
			export type Handler<P> = (payload: P) => unknown

			export type AbstractCommand = { name: CommandName; payload?: any; key?: string }

			export type InferName<T extends AbstractCommand> = T extends {
				name: infer U
				payload?: unknown
			}
				? U
				: never

			export type InferPayload<T extends AbstractCommand> = T extends {
				name: unknown
				payload: infer U
			}
				? U
				: never

			export type Commands = {
				/**
				 * Append a listener to a given command.
				 */
				on: <T extends AbstractCommand = AbstractCommand>(
					name: InferName<T>,
					handler: Handler<InferPayload<T>>,
				) => void

				/**
				 * Prepend listener to a given command.
				 */
				before: <T extends AbstractCommand = AbstractCommand>(
					name: InferName<T>,
					handler: Handler<InferPayload<T>>,
				) => void

				/**
				 * Append a listener to a given command.
				 */
				after: <T extends AbstractCommand = AbstractCommand>(
					name: InferName<T>,
					handler: Handler<InferPayload<T>>,
				) => void

				/**
				 * Remove given listener for a given command. Make sure you provide a reference to the same
				 * function as you did when calling `on`.
				 */
				off: <T extends AbstractCommand = AbstractCommand>(
					name: InferName<T>,
					handler: Handler<InferPayload<T>>,
				) => void

				/**
				 * Emit given command with given payload. You can provide an optional key that you can use
				 * later to apply targeted cancellation for the command. Emission does not happen if there
				 * is a command with given key already.
				 */
				emit: <T extends AbstractCommand = AbstractCommand>(
					name: InferName<T>,
					payload?: InferPayload<T>,
					key?: string,
				) => void

				/**
				 * Cancel a command with given payload. If you provided a key when emitting the command,
				 * you can provide it for targeted cancellation.
				 */
				cancel: <T extends AbstractCommand = AbstractCommand>(
					name: InferName<T>,
					payload?: InferPayload<T>,
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

			export type OpenExternalParams = { url: string; newTab?: boolean }

			export type Route<
				Params extends Record<string, string> = Record<string, string>,
				Data = null,
			> = {
				params: Params
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

			type Item<T = null> = Notification.ShowNotificationParams<T> & { id: string }

			type ShowNotificationParams<T = null> = {
				type: Type
				persist?: boolean
				title?: string
				message: string
				payload?: T
				Icon?: ComponentType | IconType
				duration?: number
				action?: (id: string, payload: T) => unknown
				actionText?: string
				id?: string
			}
		}

		module Modal {
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
				onHide?: () => void
			}

			export type HandleShowPayload = {
				options?: ShowOptions
				Component: ComponentType
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
				shouldShow: ItemMethod<T, boolean>

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
				 * Readable name of the command palette item. Put a translated value here.
				 */
				readableName: string

				/**
				 * Action to be executed when command palette item is used.
				 */
				onSelect: () => void

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

export type PlainDataNode = {
	data: PlainData
	id: FSID
	parent: FSID | null
	children: PlainData[]
}
