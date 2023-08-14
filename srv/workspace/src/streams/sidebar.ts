import { BehaviorSubject } from "rxjs"
import { callOnce } from "#lib/tau/mod"
import { AiOutlineRight, AiOutlineLeft } from "react-icons/ai"
import { useSubscription } from "../hooks/use-subscription"
import { useCommands } from "../hooks/use-commands"
import { useCommandPalette } from "./command-palette"
import { useContextMenu } from "./context-menu"

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
	const contextMenu = useContextMenu()

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

	const HIDE_SIDEBAR_COMMAND = commands.on("sidebar.hide", () => {
		const sidebar = sidebar$.value
		if (sidebar.disabled) return
		sidebar$.next({ disabled: false, sizes: [0, 100] })
	})

	commandPalette.addItem({
		id: "sidebar.show",
		name: "Show sidebar",
		Icon: AiOutlineRight,
		onSelect: () => commands.emit("sidebar.show"),
	})

	commandPalette.addItem({
		id: "sidebar.hide",
		name: "Hide sidebar",
		Icon: AiOutlineLeft,
		onSelect: () => commands.emit("sidebar.hide"),
	})

	contextMenu.addItem(HIDE_SIDEBAR_COMMAND, {
		Icon: AiOutlineLeft,
		shouldShow: target =>
			target === "sidebar" && !sidebar$.value.disabled && sidebar$.value.sizes[0] > 0,
		type: "update",
	})
})

export const useSidebar = () => useSubscription(sidebar$, { disabled: false, sizes: [25, 75] })
