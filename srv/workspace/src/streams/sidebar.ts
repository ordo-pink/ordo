import { AiOutlineLeft, AiOutlineLayout, AiOutlineRight } from "react-icons/ai"
import { BehaviorSubject } from "rxjs"
import { callOnce } from "#lib/tau/mod"
import { useSubscription } from "$hooks/use-subscription"
import { useCommands } from "$hooks/use-commands"
import { useCommandPalette } from "$streams/command-palette"
import { getContextMenu } from "$streams/context-menu"

export type SidebarState =
	| {
			disabled: false
			sizes: [number, number]
	  }
	| { disabled: true }

const sidebar$ = new BehaviorSubject<SidebarState>({ disabled: false, sizes: [25, 75] })

export const initSidebar = callOnce(() => {
	const commands = useCommands()
	const commandPalette = useCommandPalette()
	const contextMenu = getContextMenu()

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

	commandPalette.addItem({
		commandName: "sidebar.toggle",
		readableName: "Toggle sidebar",
		Icon: AiOutlineLayout,
		onSelect: () => commands.emit("sidebar.toggle"),
		accelerator: "ctrl+b",
	})

	contextMenu.add({
		commandName: "sidebar.show",
		readableName: "Show sidebar",
		Icon: AiOutlineRight,
		shouldShow: ({ target }) => {
			console.log(target, !sidebar$.value.disabled, (sidebar$.value as any).sizes)
			return (
				(target.classList.contains("activity-bar") || Boolean(target.closest(".activity-bar"))) &&
				!sidebar$.value.disabled &&
				sidebar$.value.sizes[0] === 0
			)
		},
		type: "update",
		accelerator: "ctrl+b",
	})

	contextMenu.add({
		commandName: "sidebar.hide",
		readableName: "Hide sidebar",
		Icon: AiOutlineLeft,
		shouldShow: ({ target }) =>
			(target.classList.contains("sidebar") ||
				target.classList.contains("activity-bar") ||
				Boolean(target.closest(".sidebar")) ||
				Boolean(target.closest(".activity-bar"))) &&
			!sidebar$.value.disabled &&
			sidebar$.value.sizes[0] !== 0,
		type: "update",
		accelerator: "ctrl+b",
	})
})

export const useSidebar = () => useSubscription(sidebar$, { disabled: false, sizes: [25, 75] })
