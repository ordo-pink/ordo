// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { useEffect, useState } from "react"
import { ConsoleLogger } from "@ordo-pink/logger"
import { Nullable, noop } from "@ordo-pink/tau"
import { __Auth$, __initAuth } from "$streams/auth"
import { __ContextMenu$, __initContextMenu } from "$streams/context-menu"
import { __Activities$, __CurrentActivity$, __initActivities } from "$streams/activities"
import { __CommandPalette$, __initCommandPalette } from "$streams/command-palette"
import { __initCommands, getCommands } from "$streams/commands"
import { __initSidebar, __Sidebar$ } from "$streams/sidebar"
import { __CurrentRoute$, __initRouter } from "$streams/router"
import CommandPaletteModal from "$components/command-palette"
import { useSubscription } from "./use-subscription"
import { useHotkeys } from "react-hotkeys-hook"
import { __Notification$, __initNotification } from "$streams/notification"
import { __Metadata$, __initData } from "$streams/data"
import { __FileAssociations$, __initFileAssociations } from "$streams/file-associations"
import { Either } from "@ordo-pink/either"

const commands = getCommands()

const isDarwin = navigator.appVersion.indexOf("Mac") !== -1
const IGNORED_KEYS = ["Control", "Shift", "Alt", "Control", "Meta"]
const ctx = { logger: ConsoleLogger }

export type UseAppInitReturns = {
	auth$: Nullable<__Auth$>
	sidebar$: Nullable<__Sidebar$>
	contextMenu$: Nullable<__ContextMenu$>
	notification$: Nullable<__Notification$>
	globalCommandPalette$: Nullable<__CommandPalette$>
	currentCommandPalette$: Nullable<__CommandPalette$>
	activities$: Nullable<__Activities$>
	currentActivity$: Nullable<__CurrentActivity$>
	currentRoute$: Nullable<__CurrentRoute$>
	data$: Nullable<__Metadata$>
	fileAssociations$: Nullable<__FileAssociations$>
}

export const useAppInit = (): UseAppInitReturns => {
	const [globalCommandPalette$, setGlobalCommandPalette$] =
		useState<Nullable<__CommandPalette$>>(null)
	const [currentCommandPalette$, setCurrentCommandPalette$] =
		useState<Nullable<__CommandPalette$>>(null)
	const [contextMenu$, setContextMenu$] = useState<Nullable<__ContextMenu$>>(null)
	const [sidebar$, setSidebar$] = useState<Nullable<__Sidebar$>>(null)
	const [notification$, setNotification$] = useState<Nullable<__Notification$>>(null)
	const [auth$, setAuth$] = useState<Nullable<__Auth$>>(null)
	const [activities$, setActivities$] = useState<Nullable<__Activities$>>(null)
	const [currentActivity$, setCurrentActivity$] = useState<Nullable<__CurrentActivity$>>(null)
	const [currentRoute$, setCurrentRoute$] = useState<Nullable<__CurrentRoute$>>(null)
	const [data$, setData$] = useState<Nullable<__Metadata$>>(null)
	const [fileAssociations$, setFileAssociations$] = useState<Nullable<__FileAssociations$>>(null)

	const commandPalette = useSubscription(currentCommandPalette$)
	const globalCommandPalette = useSubscription(globalCommandPalette$)

	useHotkeys(
		"*",
		e => {
			if (IGNORED_KEYS.includes(e.key)) return

			let hotkey = ""

			if (e.altKey) hotkey += "meta+"
			if (e.ctrlKey) hotkey += isDarwin ? "ctrl+" : "mod+"
			if (e.metaKey) hotkey += "mod+"
			if (e.shiftKey) hotkey += "shift+"

			hotkey += e.code.replace("Key", "").toLocaleLowerCase()

			const command = globalCommandPalette?.items.find(c => c.accelerator === hotkey)

			if (command) {
				e.preventDefault()
				e.stopPropagation()

				command.onSelect()
			}
		},
		{
			enableOnFormTags: true,
			enableOnContentEditable: true,
		},
		[globalCommandPalette],
	)

	useEffect(() => {
		__initCommands(ctx)
		const auth$ = __initAuth(ctx)
		setAuth$(auth$)

		const notification$ = __initNotification(ctx)
		setNotification$(notification$)

		const contextMenu$ = __initContextMenu(ctx)
		setContextMenu$(contextMenu$)

		const commandPalettes = __initCommandPalette(ctx)
		setGlobalCommandPalette$(commandPalettes?.globalCommandPalette$ ?? null)
		setCurrentCommandPalette$(commandPalettes?.currentCommandPalette$ ?? null)

		const activities = __initActivities({ logger: ConsoleLogger })
		setActivities$(activities?.activities$ ?? null)
		setCurrentActivity$(activities?.currentActivity$ ?? null)

		const fileAssociations = __initFileAssociations({ logger: ConsoleLogger })
		setFileAssociations$(fileAssociations)

		const currentRoute$ = __initRouter({ ...ctx, activities$: activities?.activities$ })
		setCurrentRoute$(currentRoute$)

		const sidebar$ = __initSidebar(ctx)
		setSidebar$(sidebar$)

		const data$ = __initData({ ...ctx, auth$ })
		setData$(data$)

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		Either.fromNullable(commandPalette)
			.chain(cp =>
				Either.fromBoolean(
					() =>
						cp.items.length > 0 ||
						(!!cp.pinnedItems && cp.pinnedItems.length > 0) ||
						!!cp.onNewItem,
					() => cp,
				),
			)
			.fold(noop, cp =>
				commands.emit<cmd.modal.show>("modal.show", {
					Component: () => (
						<CommandPaletteModal
							items={cp.items}
							onNewItem={cp.onNewItem}
							multiple={cp.multiple}
							pinnedItems={cp.pinnedItems}
						/>
					),
					// The onHide hook makes a redundant call for hiding modal, but helps with closing the
					// command palette when the modal is closed with a click on the overlay or Esc key press.
					options: {
						showCloseButton: false,
						onHide: () => commands.emit<cmd.commandPalette.hide>("command-palette.hide"),
					},
				}),
			)
	}, [commandPalette])

	return {
		auth$,
		sidebar$,
		data$: data$,
		activities$,
		contextMenu$,
		notification$,
		currentRoute$,
		currentActivity$,
		fileAssociations$,
		globalCommandPalette$,
		currentCommandPalette$,
	}
}
