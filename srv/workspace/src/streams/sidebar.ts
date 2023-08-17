// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { AiOutlineLeft, AiOutlineLayout, AiOutlineRight } from "react-icons/ai"
import { BehaviorSubject, Observable } from "rxjs"
import { Unary, callOnce } from "#lib/tau/mod"
import { getCommands } from "$streams/commands"
import { Logger } from "#lib/logger/mod"
import { cmd } from "#lib/libfe/mod"

const commands = getCommands()

// --- Internal ---

export type __Sidebar$ = Observable<SidebarState>
export const __initSidebar: InitSidebar = callOnce(({ logger }) => {
	logger.debug("Initializing sidebar")

	commands.on<cmd.sidebar.disable>("sidebar.disable", () => {
		const sidebar = sidebar$.value
		if (sidebar.disabled) return
		sidebar$.next({ disabled: true })
	})

	commands.on<cmd.sidebar.enable>("sidebar.enable", () => {
		const sidebar = sidebar$.value
		if (!sidebar.disabled) return
		sidebar$.next({ disabled: false, sizes: [25, 75] })
	})

	commands.on<cmd.sidebar.setSize>("sidebar.set-size", ({ payload }) => {
		const sidebar = sidebar$.value
		if (sidebar.disabled) return
		sidebar$.next({ disabled: false, sizes: payload })
	})

	commands.on<cmd.sidebar.show>("sidebar.show", ({ payload = [25, 75] }) => {
		const sidebar = sidebar$.value
		if (sidebar.disabled) return
		sidebar$.next({ disabled: false, sizes: payload })
	})

	commands.on<cmd.sidebar.hide>("sidebar.hide", () => {
		const sidebar = sidebar$.value
		if (sidebar.disabled) return
		sidebar$.next({ disabled: false, sizes: [0, 100] })
	})

	commands.on<cmd.sidebar.toggle>("sidebar.toggle", () => {
		const sidebar = sidebar$.value
		if (sidebar.disabled) return

		sidebar$.next(
			sidebar.sizes[0] > 0
				? { disabled: false, sizes: [0, 100] }
				: { disabled: false, sizes: [25, 75] },
		)
	})

	commands.emit<cmd.commandPalette.add>("command-palette.add", {
		id: "sidebar.toggle",
		readableName: "Toggle sidebar",
		Icon: AiOutlineLayout,
		onSelect: () => commands.emit("sidebar.toggle"),
		accelerator: "mod+b",
	})

	commands.emit<cmd.contextMenu.add>("context-menu.add", {
		commandName: "sidebar.show",
		readableName: "Show sidebar",
		Icon: AiOutlineRight,
		shouldShow: ({ event }) => {
			return (
				event.currentTarget &&
				(event.currentTarget.classList.contains("activity-bar") ||
					Boolean(event.currentTarget.closest(".activity-bar"))) &&
				!sidebar$.value.disabled &&
				sidebar$.value.sizes[0] === 0
			)
		},
		type: "update",
		accelerator: "mod+b",
	})

	commands.emit<cmd.contextMenu.add>("context-menu.add", {
		commandName: "sidebar.hide",
		readableName: "Hide sidebar",
		Icon: AiOutlineLeft,
		shouldShow: ({ event }) =>
			(event.currentTarget.classList.contains("sidebar") ||
				event.currentTarget.classList.contains("activity-bar") ||
				Boolean(event.currentTarget.closest(".sidebar")) ||
				Boolean(event.currentTarget.closest(".activity-bar"))) &&
			!sidebar$.value.disabled &&
			sidebar$.value.sizes[0] !== 0,
		type: "update",
		accelerator: "mod+b",
	})

	return sidebar$
})

type SidebarState = { disabled: false; sizes: [number, number] } | { disabled: true }
type InitSidebarP = { logger: Logger }
type InitSidebar = Unary<InitSidebarP, __Sidebar$>

const sidebar$ = new BehaviorSubject<SidebarState>({ disabled: false, sizes: [25, 75] })
