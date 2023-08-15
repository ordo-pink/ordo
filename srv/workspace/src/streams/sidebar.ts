import { AiOutlineLeft, AiOutlineLayout, AiOutlineRight } from "react-icons/ai"
import { BehaviorSubject, Observable } from "rxjs"
import { Unary, callOnce } from "#lib/tau/mod"
import { getCommands } from "$streams/commands"
import { ContextMenuItem } from "$streams/context-menu"
import { Logger } from "#lib/logger/mod"

const commands = getCommands()

// --- Internal ---

export type __Sidebar$ = Observable<SidebarState>
export const __initSidebar: InitSidebar = callOnce(({ logger }) => {
	logger.debug("Initializing sidebar")

	commands.on("sidebar.disable", () => {
		const sidebar = sidebar$.value
		if (sidebar.disabled) return
		sidebar$.next({ disabled: true })
	})

	commands.on("sidebar.enable", () => {
		const sidebar = sidebar$.value
		if (!sidebar.disabled) return
		sidebar$.next({ disabled: false, sizes: [25, 75] })
	})

	commands.on("sidebar.set-size", ({ payload }) => {
		const sidebar = sidebar$.value
		if (sidebar.disabled) return
		sidebar$.next({ disabled: false, sizes: payload })
	})

	commands.on("sidebar.show", ({ payload = [25, 75] }) => {
		const sidebar = sidebar$.value
		if (sidebar.disabled) return
		sidebar$.next({ disabled: false, sizes: payload })
	})

	commands.on("sidebar.hide", () => {
		const sidebar = sidebar$.value
		if (sidebar.disabled) return
		sidebar$.next({ disabled: false, sizes: [0, 100] })
	})

	commands.on("sidebar.toggle", () => {
		const sidebar = sidebar$.value
		if (sidebar.disabled) return

		sidebar$.next(
			sidebar.sizes[0] > 0
				? { disabled: false, sizes: [0, 100] }
				: { disabled: false, sizes: [25, 75] }
		)
	})

	commands.emit("command-palette.add", {
		id: "sidebar.toggle",
		readableName: "Toggle sidebar",
		Icon: AiOutlineLayout,
		onSelect: () => commands.emit("sidebar.toggle"),
		accelerator: "mod+b",
	})

	commands.emit<ContextMenuItem>("context-menu.add", {
		commandName: "sidebar.show",
		readableName: "Show sidebar",
		Icon: AiOutlineRight,
		shouldShow: ({ event }) => {
			return (
				(event.currentTarget.classList.contains("activity-bar") ||
					Boolean(event.currentTarget.closest(".activity-bar"))) &&
				!sidebar$.value.disabled &&
				sidebar$.value.sizes[0] === 0
			)
		},
		type: "update",
		accelerator: "mod+b",
	})

	commands.emit<ContextMenuItem>("context-menu.add", {
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
