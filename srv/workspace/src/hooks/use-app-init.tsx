import { useEffect, useState } from "react"
import { ConsoleLogger } from "#lib/logger/mod"
import { Nullable } from "#lib/tau/mod"
import { Hosts, initHosts, refreshAuthInfo, onBeforeQuit } from "$streams/auth"
import { __ContextMenu$, __initContextMenu } from "$streams/context-menu"
import { initActivities, initExtensions } from "$streams/extensions"
import { __CommandPalette$, __initCommandPalette } from "$streams/command-palette"
import { __Modal$, __initModal } from "$streams/modal"
import { __initCommands, getCommands } from "$streams/commands"
import { __initSidebar, __Sidebar$ } from "$streams/sidebar"
import { initRouter } from "$streams/router"
import CommandPaletteModal from "$components/command-palette"
import { useSubscription } from "./use-subscription"
import { useHotkeys } from "react-hotkeys-hook"

const commands = getCommands()

const refreshToken = (hosts: Hosts) =>
	fetch(`${hosts.id}/refresh-token`, { method: "POST", credentials: "include" })
		.then(res => res.json())
		.then(res => {
			if (res.accessToken) return refreshAuthInfo(res)

			window.location.href = `${hosts.web}`
		})

const isDarwin = navigator.appVersion.indexOf("Mac") !== -1
const IGNORED_KEYS = ["Control", "Shift", "Alt", "Control", "Meta"]
const ctx = { logger: ConsoleLogger }

export type UseAppInitReturns = {
	modal$: Nullable<__Modal$>
	sidebar$: Nullable<__Sidebar$>
	contextMenu$: Nullable<__ContextMenu$>
	globalCommandPalette$: Nullable<__CommandPalette$>
	currentCommandPalette$: Nullable<__CommandPalette$>
}

export const useAppInit = (hosts: Hosts): UseAppInitReturns => {
	const [globalCommandPalette$, setGlobalCommandPalette$] =
		useState<Nullable<__CommandPalette$>>(null)
	const [currentCommandPalette$, setCurrentCommandPalette$] =
		useState<Nullable<__CommandPalette$>>(null)
	const [contextMenu$, setContextMenu$] = useState<Nullable<__ContextMenu$>>(null)
	const [modal$, setModal$] = useState<Nullable<__Modal$>>(null)
	const [sidebar$, setSidebar$] = useState<Nullable<__Sidebar$>>(null)

	const commandPaletteItems = useSubscription(currentCommandPalette$)
	const globalCommandPaletteItems = useSubscription(globalCommandPalette$)

	useHotkeys(
		"*",
		e => {
			if (IGNORED_KEYS.includes(e.key)) return

			let hotkey = ""

			if (e.ctrlKey) hotkey += isDarwin ? "ctrl+" : "mod+"
			if (e.metaKey) hotkey += "mod+"
			if (e.altKey) hotkey += "meta+"
			if (e.shiftKey) hotkey += "shift+"

			hotkey += e.code.replace("Key", "").toLocaleLowerCase()

			const command = globalCommandPaletteItems?.find(c => c.accelerator?.includes(hotkey))

			if (command) command.onSelect()
		},
		[globalCommandPaletteItems]
	)

	useEffect(() => {
		initHosts(hosts) // TODO: 4
		__initCommands(ctx)

		const modal$ = __initModal(ctx)
		setModal$(modal$)

		const contextMenu$ = __initContextMenu(ctx)
		setContextMenu$(contextMenu$)

		const commandPalettes = __initCommandPalette(ctx)

		setGlobalCommandPalette$(commandPalettes?.globalCommandPalette$)
		setCurrentCommandPalette$(commandPalettes?.currentCommandPalette$)

		const router$ = initRouter(ctx) // TODO: 5

		const sidebar$ = __initSidebar(ctx)
		setSidebar$(sidebar$)

		initExtensions({ logger: ConsoleLogger, router$, extensions: [] }) // TODO: 6
		initActivities()

		refreshToken(hosts)
		const interval = setInterval(() => refreshToken(hosts), 50000)

		return () => {
			onBeforeQuit()
			clearInterval(interval)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (!commandPaletteItems || !commandPaletteItems.length) return

		commands.emit("modal.show", {
			Component: () => <CommandPaletteModal items={commandPaletteItems} />,
			// The onHide hook makes a redundant call for hiding modal, but helps with closing the
			// command palette when the modal is closed with a click on the overlay or Esc key press.
			options: { showCloseButton: false, onHide: () => commands.emit("command-palette.hide") },
		})
	}, [commandPaletteItems])

	return { contextMenu$, modal$, globalCommandPalette$, currentCommandPalette$, sidebar$ }
}
