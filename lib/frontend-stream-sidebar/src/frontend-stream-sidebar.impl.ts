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

import { BehaviorSubject } from "rxjs"

import { type TGetSidebarFn, type TSidebarState } from "@ordo-pink/core"
import { KnownFunctions } from "@ordo-pink/frontend-known-functions"
import { RRR } from "@ordo-pink/data"
import { Result } from "@ordo-pink/result"
import { type TLogger } from "@ordo-pink/logger"
import { call_once } from "@ordo-pink/tau"

import {
	DEFAULT_WORKSPACE_SPLIT_SIZE,
	DEFAULT_WORKSPACE_SPLIT_SIZE_NARROW_OPEN,
	DEFAULT_WORKSPACE_SPLIT_SIZE_NO_SIDEBAR,
	NARROW_WINDOW_BREAKPOINT,
} from "./frontend-stream-sidebar.constants"

type TInitSidebarFn = (params: { commands: Client.Commands.Commands; logger: TLogger }) => {
	get_sidebar: TGetSidebarFn
}
export const init_sidebar: TInitSidebarFn = call_once(({ commands, logger }) => {
	logger.debug("Initialising sidebar...")

	commands.on<cmd.sidebar.disable>("sidebar.disable", handle_disable_sidebar)
	commands.on<cmd.sidebar.enable>("sidebar.enable", handle_enable_sidebar)
	commands.on<cmd.sidebar.set_size>("sidebar.set-size", handle_set_sidebar_size)
	commands.on<cmd.sidebar.show>("sidebar.show", handle_sidebar_show)
	commands.on<cmd.sidebar.hide>("sidebar.hide", handle_sidebar_hide)
	commands.on<cmd.sidebar.toggle>("sidebar.toggle", handle_sidebar_toggle)

	// commands.emit<cmd.command_palette.add>("command-palette.add", {
	// 	id: "sidebar.toggle",
	// 	readable_name: "Показать/скрыть боковую панель",
	// 	on_select: () => {
	// 		commands.emit<cmd.command_palette.hide>("command-palette.hide")
	// 		commands.emit<cmd.sidebar.toggle>("sidebar.toggle")
	// 	},
	// 	accelerator: "mod+b",
	// })

	// commands.emit<cmd.ctx_menu.add>("context-menu.add", {
	// 	cmd: "sidebar.show",
	// 	readable_name: "Показать боковую панель",
	// 	should_show: ({ event }) => {
	// 		return (
	// 			event.currentTarget &&
	// 			(event.currentTarget.classList.contains("activity-bar") ||
	// 				Boolean(event.currentTarget.closest(".activity-bar"))) &&
	// 			!sidebar$.value.disabled &&
	// 			sidebar$.value.sizes[0] === 0
	// 		)
	// 	},
	// 	type: "update",
	// 	accelerator: "mod+b",
	// })

	// commands.emit<cmd.ctx_menu.add>("context-menu.add", {
	// 	cmd: "sidebar.hide",
	// 	readable_name: "Скрыть боковую панель",
	// 	should_show: ({ event }) =>
	// 		(event.currentTarget.classList.contains("sidebar") ||
	// 			event.currentTarget.classList.contains("activity-bar") ||
	// 			Boolean(event.currentTarget.closest(".sidebar")) ||
	// 			Boolean(event.currentTarget.closest(".activity-bar"))) &&
	// 		!sidebar$.value.disabled &&
	// 		sidebar$.value.sizes[0] !== 0,
	// 	type: "update",
	// 	accelerator: "mod+b",
	// })

	logger.debug("Sidebar initialised.")

	return {
		get_sidebar: fid => () =>
			Result.If(KnownFunctions.check_permissions(fid, { queries: ["application.sidebar"] }))
				.pipe(Result.ops.err_map(() => eperm(`get_sidebar -> fid: ${String(fid)}`)))
				.pipe(Result.ops.map(() => sidebar$.asObservable())),
	}
})

// --- Internal ---

const sidebar$ = new BehaviorSubject<TSidebarState>({ disabled: true })

const eperm = RRR.codes.eperm("Init sidebar")

const handle_disable_sidebar = () => {
	const sidebar = sidebar$.getValue()

	if (sidebar.disabled) return

	sidebar$.next({ disabled: true })
}

const handle_enable_sidebar = () => {
	const sidebar = sidebar$.getValue()

	if (!sidebar.disabled) return

	sidebar$.next({ disabled: false, sizes: DEFAULT_WORKSPACE_SPLIT_SIZE })
}

const handle_set_sidebar_size = (payload: cmd.sidebar.set_size["payload"]) => {
	const sidebar = sidebar$.getValue()

	if (sidebar.disabled) return

	sidebar$.next({ disabled: false, sizes: payload })
}

const handle_sidebar_show = (payload: cmd.sidebar.show["payload"]) => {
	const sidebar = sidebar$.getValue()

	if (sidebar.disabled) return

	const window_width = window.innerWidth
	const isNarrow = window_width < NARROW_WINDOW_BREAKPOINT
	const sizes = isNarrow ? DEFAULT_WORKSPACE_SPLIT_SIZE_NARROW_OPEN : DEFAULT_WORKSPACE_SPLIT_SIZE

	sidebar$.next({ disabled: false, sizes: payload ?? sizes })
}

const handle_sidebar_hide = () => {
	const sidebar = sidebar$.getValue()

	if (sidebar.disabled) return

	sidebar$.next({ disabled: false, sizes: DEFAULT_WORKSPACE_SPLIT_SIZE_NO_SIDEBAR })
}

const handle_sidebar_toggle = () => {
	const sidebar = sidebar$.getValue()

	if (sidebar.disabled) return

	const window_width = window.innerWidth
	const is_narrow = window_width < NARROW_WINDOW_BREAKPOINT
	const sizes = is_narrow ? DEFAULT_WORKSPACE_SPLIT_SIZE_NARROW_OPEN : DEFAULT_WORKSPACE_SPLIT_SIZE

	sidebar$.next({
		disabled: false,
		sizes: sidebar.sizes[0] > 0 ? DEFAULT_WORKSPACE_SPLIT_SIZE_NO_SIDEBAR : sizes,
	})
}
