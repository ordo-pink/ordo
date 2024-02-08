import { AiOutlineLayout, AiOutlineLeft, AiOutlineRight } from "react-icons/ai"
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject"

import {
	DEFAULT_WORKSPACE_SPLIT_SIZE,
	DEFAULT_WORKSPACE_SPLIT_SIZE_NARROW_OPEN,
	DEFAULT_WORKSPACE_SPLIT_SIZE_NO_SIDEBAR,
	NARROW_WINDOW_BREAKPOINT,
} from "./frontend-stream-sidebar.constants"
import { callOnce } from "@ordo-pink/tau"
import { getCommands } from "@ordo-pink/frontend-stream-commands"

import { type SidebarState } from "./frontend-stream-sidebar.types"

export const sidebar$ = new BehaviorSubject<SidebarState>({ disabled: true })

export const __initSidebar = callOnce((fid: symbol) => {
	const commands = getCommands(fid)

	commands.on<cmd.sidebar.disable>("sidebar.disable", () => {
		const sidebar = sidebar$.value
		if (sidebar.disabled) return
		sidebar$.next({ disabled: true })
	})

	commands.on<cmd.sidebar.enable>("sidebar.enable", () => {
		const sidebar = sidebar$.value
		if (!sidebar.disabled) return
		sidebar$.next({ disabled: false, sizes: DEFAULT_WORKSPACE_SPLIT_SIZE })
	})

	commands.on<cmd.sidebar.setSize>("sidebar.set-size", ({ payload }) => {
		const sidebar = sidebar$.value
		if (sidebar.disabled) return
		sidebar$.next({ disabled: false, sizes: payload })
	})

	commands.on<cmd.sidebar.show>("sidebar.show", ({ payload }) => {
		const sidebar = sidebar$.value
		if (sidebar.disabled) return

		const { innerWidth } = window
		const isNarrow = innerWidth < NARROW_WINDOW_BREAKPOINT
		const sizes = isNarrow ? DEFAULT_WORKSPACE_SPLIT_SIZE_NARROW_OPEN : DEFAULT_WORKSPACE_SPLIT_SIZE

		sidebar$.next({ disabled: false, sizes: payload ?? sizes })
	})

	commands.on<cmd.sidebar.hide>("sidebar.hide", () => {
		const sidebar = sidebar$.value
		if (sidebar.disabled) return
		sidebar$.next({ disabled: false, sizes: DEFAULT_WORKSPACE_SPLIT_SIZE_NO_SIDEBAR })
	})

	commands.on<cmd.sidebar.toggle>("sidebar.toggle", () => {
		const sidebar = sidebar$.value

		if (sidebar.disabled) return

		console.log(sidebar)

		const { innerWidth } = window
		const isNarrow = innerWidth < NARROW_WINDOW_BREAKPOINT
		const sizes = isNarrow ? DEFAULT_WORKSPACE_SPLIT_SIZE_NARROW_OPEN : DEFAULT_WORKSPACE_SPLIT_SIZE

		sidebar$.next({
			disabled: false,
			sizes: sidebar.sizes[0] > 0 ? DEFAULT_WORKSPACE_SPLIT_SIZE_NO_SIDEBAR : sizes,
		})
	})

	commands.emit<cmd.commandPalette.add>("command-palette.add", {
		id: "sidebar.toggle",
		readableName: "Показать/скрыть боковую панель",
		Icon: AiOutlineLayout,
		onSelect: () => {
			commands.emit<cmd.commandPalette.hide>("command-palette.hide")
			commands.emit<cmd.sidebar.toggle>("sidebar.toggle")
		},
		accelerator: "mod+b",
	})

	commands.emit<cmd.ctxMenu.add>("context-menu.add", {
		cmd: "sidebar.show",
		readableName: "Показать боковую панель",
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

	commands.emit<cmd.ctxMenu.add>("context-menu.add", {
		cmd: "sidebar.hide",
		readableName: "Скрыть боковую панель",
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
})
