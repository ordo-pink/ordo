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

import { BehaviorSubject, Observable, noop, pairwise } from "rxjs"
import { BsToggle2Off, BsToggle2On } from "react-icons/bs"
import Split from "split.js"

import { type TEnabledSidebar, type TKnownFunctions, type TSidebarState } from "@ordo-pink/core"
import { RRR } from "@ordo-pink/data"
import { Result } from "@ordo-pink/result"
import { Switch } from "@ordo-pink/switch"
import { type TLogger } from "@ordo-pink/logger"
import { type TOption } from "@ordo-pink/option"
import { type TWorkspaceSplitSize } from "@ordo-pink/core"

export const NARROW_WINDOW_BREAKPOINT = 768
export const DEFAULT_WORKSPACE_SPLIT_SIZE = [80, 20] as TWorkspaceSplitSize
export const DEFAULT_WORKSPACE_SPLIT_SIZE_NARROW_OPEN = [0, 100] as TWorkspaceSplitSize
export const DEFAULT_WORKSPACE_SPLIT_SIZE_NO_SIDEBAR = [100, 0] as TWorkspaceSplitSize

export const init_workspace = (
	logger: TLogger,
	known_functions: TKnownFunctions,
	commands: Client.Commands.Commands,
	current_activity$: Observable<TOption<Functions.Activity>>,
) => {
	logger.debug("🟡 Initialising sidebar...")

	commands.on("cmd.application.sidebar.disable", () => {
		const sidebar = sidebar$.getValue()

		if (sidebar.disabled) return

		sidebar$.next({ disabled: true })
	})

	commands.on("cmd.application.sidebar.enable", () => {
		const sidebar = sidebar$.getValue()

		if (!sidebar.disabled) return

		sidebar$.next({ disabled: false, sizes: DEFAULT_WORKSPACE_SPLIT_SIZE })
	})

	commands.on("cmd.application.sidebar.set_size", sizes => {
		const sidebar = sidebar$.getValue()

		if (sidebar.disabled) return

		sidebar$.next({ disabled: false, sizes })
	})

	commands.on("cmd.application.sidebar.show", payload => {
		const sidebar = sidebar$.getValue()

		if (sidebar.disabled) return

		const window_width = window.innerWidth
		const isNarrow = window_width < NARROW_WINDOW_BREAKPOINT
		const sizes = isNarrow ? DEFAULT_WORKSPACE_SPLIT_SIZE_NARROW_OPEN : DEFAULT_WORKSPACE_SPLIT_SIZE

		sidebar$.next({ disabled: false, sizes: payload ?? sizes })
	})

	commands.on("cmd.application.sidebar.hide", () => {
		const sidebar = sidebar$.getValue()

		if (sidebar.disabled) return

		sidebar$.next({ disabled: false, sizes: DEFAULT_WORKSPACE_SPLIT_SIZE_NO_SIDEBAR })
	})

	commands.on("cmd.application.sidebar.toggle", () => {
		const sidebar = sidebar$.getValue()

		if (sidebar.disabled) return

		const window_width = window.innerWidth
		const is_narrow = window_width < NARROW_WINDOW_BREAKPOINT
		const sizes = is_narrow
			? DEFAULT_WORKSPACE_SPLIT_SIZE_NARROW_OPEN
			: DEFAULT_WORKSPACE_SPLIT_SIZE

		sidebar$.next({
			disabled: false,
			sizes: sidebar.sizes[0] > 0 ? DEFAULT_WORKSPACE_SPLIT_SIZE_NO_SIDEBAR : sizes,
		})
	})

	commands.emit("cmd.application.command_palette.add", {
		id: "sidebar.toggle",
		readable_name: "t.common.components.sidebar.toggle",
		Icon: BsToggle2Off,
		on_select: () => {
			commands.emit("cmd.application.sidebar.toggle")
		},
		accelerator: "mod+b",
	})

	commands.emit("cmd.application.context_menu.add", {
		cmd: "cmd.application.sidebar.show",
		readable_name: "common.sidebar_show",
		Icon: BsToggle2On,
		should_show: ({ event }) =>
			Boolean(event.currentTarget) &&
			(event.currentTarget.classList.contains("activity-bar") ||
				Boolean(event.currentTarget.closest(".activity-bar"))) &&
			!sidebar$.value.disabled &&
			sidebar$.value.sizes[1] === 0,
		type: "update",
		accelerator: "mod+b",
	})

	commands.emit("cmd.application.context_menu.add", {
		cmd: "cmd.application.sidebar.hide",
		readable_name: "common.sidebar_hide",
		Icon: BsToggle2Off,
		should_show: ({ event }) => {
			return (
				(event.currentTarget.classList.contains("sidebar") ||
					event.currentTarget.classList.contains("activity-bar") ||
					Boolean(event.currentTarget.closest(".sidebar")) ||
					Boolean(event.currentTarget.closest(".activity-bar"))) &&
				!sidebar$.value.disabled &&
				sidebar$.value.sizes[1] !== 0
			)
		},
		type: "update",
		accelerator: "mod+b",
	})

	let split: any

	const main_element = document.querySelector("main") as HTMLDivElement
	const sidebar_element = document.querySelector("#sidebar") as HTMLDivElement
	const workspace_element = document.querySelector("#workspace") as HTMLDivElement

	current_activity$.pipe(pairwise()).subscribe(([prev, next]) => {
		if (!prev.is_none)
			prev.unwrap()!.on_unmount?.({ workspace: workspace_element, sidebar: sidebar_element })

		next.cata({
			Some: activity => {
				workspace_element.innerHTML = ""
				sidebar_element.innerHTML = ""

				activity.render_workspace!(workspace_element)

				if (activity.render_sidebar) {
					commands.emit("cmd.application.sidebar.enable")
					activity.render_sidebar(sidebar_element)
				} else {
					commands.emit("cmd.application.sidebar.disable")
				}
			},
			None: noop,
		})
	})

	// TODO: Move classes away from HTML
	sidebar$.subscribe(sidebar => {
		Switch.OfTrue()
			.case(sidebar.disabled && !!split, () => {
				split = split?.destroy?.()
				sidebar_element.innerHTML = ""
				;(sidebar_element as any).classList.replace("visible", "hidden")
			})
			.case(!sidebar.disabled && !split, () => {
				;(sidebar_element as any).classList.replace("hidden", "visible")
				if (!document.getElementById("#sidebar")) {
					main_element.appendChild(sidebar_element)
				}

				split = Split(["#workspace", "#sidebar"], {
					minSize: 0,
					maxSize: window.innerWidth,
					sizes: (sidebar as TEnabledSidebar).sizes,
					snapOffset: window.innerWidth * 0.2,
					dragInterval: window.innerWidth * 0.05,
					onDrag: sizes => {
						Switch.OfTrue()
							.case(sizes[0] < 20, () =>
								workspace_element.classList.replace("opacity-100", "opacity-0"),
							)
							.case(sizes[0] > 20, () =>
								workspace_element.classList.replace("opacity-0", "opacity-100"),
							)
							.default(noop)

						Switch.OfTrue()
							.case(sizes[1] < 20, () =>
								sidebar_element.classList.replace("opacity-100", "opacity-0"),
							)
							.case(sizes[1] > 20, () =>
								sidebar_element.classList.replace("opacity-0", "opacity-100"),
							)
							.default(noop)
					},
					onDragEnd: sizes =>
						commands.emit("cmd.application.sidebar.set_size", [
							Math.round(sizes[0]),
							Math.round(sizes[1]),
						]),
				})
			})
			.case(!sidebar.disabled && !!split, () => {
				split.setSizes((sidebar as TEnabledSidebar).sizes)
			})
			.default(noop)
	})

	logger.debug("🟢 Initialised sidebar.")

	return {
		get_sidebar: (fid: symbol | null) => () =>
			Result.If(known_functions.has_permissions(fid, { queries: ["application.sidebar"] }))
				.pipe(Result.ops.map(() => sidebar$.asObservable()))
				.pipe(Result.ops.err_map(() => eperm(`get_sidebar -> fid: ${String(fid)}`))),
	}
}

// --- Internal ---

const eperm = RRR.codes.eperm("init_sidebar")

const sidebar$ = new BehaviorSubject<TSidebarState>({ disabled: true })
