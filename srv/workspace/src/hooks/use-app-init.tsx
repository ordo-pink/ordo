import { useEffect, useState } from "react"
import { ConsoleLogger } from "#lib/logger/mod"
import { Nullable } from "#lib/tau/mod"
import { Hosts, initHosts, refreshAuthInfo, onBeforeQuit } from "$streams/auth"
import { __ContextMenu$, __initContextMenu } from "$streams/context-menu"
import { initActivities, initExtensions } from "$streams/extensions"
import { __CommandPalette$, __initCommandPalette } from "$streams/command-palette"
import { __Modal$, __initModal } from "$streams/modal"
import { __initCommands, getCommands } from "$streams/commands"
import { initSidebar } from "$streams/sidebar"
import { initRouter } from "$streams/router"
import CommandPaletteModal from "$components/command-palette"
import { useSubscription } from "./use-subscription"
import { useHotkeys } from "react-hotkeys-hook"

const ctx = { logger: ConsoleLogger }

const commands = getCommands()
const isDarwin = navigator.appVersion.indexOf("Mac") !== -1

const refreshToken = (hosts: Hosts) => {
	fetch(`${hosts.id}/refresh-token`, { method: "POST", credentials: "include" })
		.then(res => res.json())
		.then(res => {
			if (res.accessToken) return refreshAuthInfo(res)

			window.location.href = `${hosts.web}`
		})
}

const IGNORED_KEYS = ["Control", "Shift", "Alt", "Control", "Meta"]

export type UseAppInitReturns = {
	contextMenu$: Nullable<__ContextMenu$>
	modal$: Nullable<__Modal$>
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

	const commandPaletteItems = useSubscription(currentCommandPalette$)
	const globalCommandPaletteItems = useSubscription(globalCommandPalette$)

	useHotkeys(
		"*",
		event => {
			if (IGNORED_KEYS.includes(event.key)) return

			let hotkey = ""

			if (event.ctrlKey) hotkey += isDarwin ? "ctrl+" : "mod+"
			if (event.metaKey) hotkey += "mod+"
			if (event.altKey) hotkey += "meta+"
			if (event.shiftKey) hotkey += "shift+"

			hotkey += event.code.replace("Key", "").toLocaleLowerCase()

			const command = globalCommandPaletteItems?.find(command =>
				command.accelerator?.includes(hotkey)
			)

			if (command) {
				command.onSelect()
			}
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

		initSidebar() // TODO: 3
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

	return { contextMenu$, modal$, globalCommandPalette$, currentCommandPalette$ }
}
