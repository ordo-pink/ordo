import { BehaviorSubject } from "rxjs"
import { callOnce } from "#lib/tau/mod"
import { AiOutlineRight, AiOutlineLeft } from "react-icons/ai"
import { useSubscription } from "../hooks/use-subscription"
import { useCommands } from "src/hooks/use-commands"
import { useCommandPalette } from "./command-palette"

type State =
	| {
			disabled: false
			sizes: [number, number]
	  }
	| { disabled: true }

const sidebar$ = new BehaviorSubject<State>({ disabled: false, sizes: [25, 75] })

export const initSidebar = callOnce(() => {
	const commands = useCommands()
	const commandPalette = useCommandPalette()

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
})

export const useSidebar = () => useSubscription(sidebar$, { disabled: false, sizes: [25, 75] })
