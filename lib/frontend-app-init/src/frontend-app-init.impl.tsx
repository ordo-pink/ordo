// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { BsCommand } from "react-icons/bs"
import { useEffect } from "react"
import { useHotkeys } from "react-hotkeys-hook"

import {
	currentCommandPalette$,
	globalCommandPalette$,
} from "@ordo-pink/frontend-stream-command-palette"
import { useCommands, useIsAuthenticated, useSubscription } from "@ordo-pink/frontend-react-hooks"
import { Either } from "@ordo-pink/either"
import { noop } from "@ordo-pink/tau"

import CommandPaletteModal from "@ordo-pink/frontend-react-sections/command-palette"
import Null from "@ordo-pink/frontend-react-components/null"

// TODO: Move to hooks
const isDarwin = navigator.appVersion.indexOf("Mac") !== -1
const IGNORED_KEYS = ["Control", "Shift", "Alt", "Control", "Meta"]

export const useAppInit = () => {
	const commands = useCommands()
	const isAuthenticated = useIsAuthenticated()
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
		commands.emit<cmd.commandPalette.add>("command-palette.add", {
			id: "command-palette.hide",
			onSelect: () => commands.emit<cmd.commandPalette.hide>("command-palette.hide"),
			readableName: "Скрыть панель команд",
			Icon: BsCommand,
			accelerator: "mod+shift+p",
		})
	}, [commands])

	useEffect(() => {
		Either.fromBoolean(() => isAuthenticated).fold(Null, () => {
			commands.emit<cmd.user.refreshInfo>("user.refresh")
			commands.emit<cmd.data.refreshRoot>("data.refresh-root")
		})
	}, [commands, isAuthenticated])

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
					Component: () =>
						(
							<CommandPaletteModal
								items={cp.items}
								onNewItem={cp.onNewItem}
								multiple={cp.multiple}
								pinnedItems={cp.pinnedItems}
							/>
						) as any,
					// The onHide hook makes a redundant call for hiding modal, but helps with closing the
					// command palette when the modal is closed with a click on the overlay or Esc key press.
					options: {
						showCloseButton: false,
						onHide: () => commands.emit<cmd.commandPalette.hide>("command-palette.hide"),
					},
				}),
			)
	}, [commandPalette, commands])
}
