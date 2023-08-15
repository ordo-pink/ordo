import { AiOutlineLeft, AiOutlineLayout, AiOutlineRight } from "react-icons/ai"
import { BehaviorSubject } from "rxjs"
import { callOnce } from "#lib/tau/mod"
import { useStrictSubscription } from "$hooks/use-subscription"
import { getCommands } from "$streams/commands"
import { ContextMenuItem } from "$streams/context-menu"

export type SidebarState =
	| {
			disabled: false
			sizes: [number, number]
	  }
	| { disabled: true }

const commands = getCommands()

const sidebar$ = new BehaviorSubject<SidebarState>({ disabled: false, sizes: [25, 75] })

export const initSidebar = callOnce(() => {
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
		commands.emit(sidebar.sizes[0] > 0 ? "sidebar.hide" : "sidebar.show")
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
})

export const useSidebar = () =>
	useStrictSubscription(sidebar$, { disabled: false, sizes: [25, 75] })
