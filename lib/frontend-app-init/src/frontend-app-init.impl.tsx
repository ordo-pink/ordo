// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { type ComponentType, useEffect } from "react"
import { type HotkeyCallback, useHotkeys } from "react-hotkeys-hook"
import { BsCommand } from "react-icons/bs"

import {
	type TCommandPaletteState,
	currentCommandPalette$,
	globalCommandPalette$,
} from "@ordo-pink/frontend-stream-command-palette"
import { type TEither, chainE, fromBooleanE, fromNullableE, mapE } from "@ordo-pink/either"
import {
	useCommands,
	useIsApple,
	useIsAuthenticated,
	useSubscription,
} from "@ordo-pink/frontend-react-hooks"
import { noop } from "@ordo-pink/tau"

import CommandPaletteModal from "@ordo-pink/frontend-react-sections/command-palette"

export const useAppInit = () => {
	const commands = useCommands()

	const isApple = useIsApple()
	const isAuthenticated = useIsAuthenticated()

	const customCommandPalette = useSubscription(currentCommandPalette$)
	const globalCommandPalette = useSubscription(globalCommandPalette$)

	// Register global hotkeys registerred via CommandPalette.
	useHotkeys(
		"*",
		handleHotkey({ commandPalette: globalCommandPalette, isApple }),
		{ enableOnFormTags: true, enableOnContentEditable: true },
		[globalCommandPalette, isApple],
	)

	// Register global hotkey for hiding CommandPalette.
	useEffect(() => {
		commands.emit<cmd.command_palette.add>("command-palette.add", {
			id: "command-palette.hide",
			onSelect: () => commands.emit<cmd.command_palette.hide>("command-palette.hide"),
			readableName: "Скрыть панель команд",
			Icon: BsCommand,
			accelerator: "mod+shift+p",
		})

		return () =>
			void commands.emit<cmd.command_palette.remove>(
				"command-palette.remove",
				"command-palette.hide",
			)
	}, [commands])

	// Refresh application state upon after the user is authenticated.
	useEffect(() => {
		fromBooleanE(isAuthenticated).fold(noop, () => {
			commands.emit<cmd.user.refresh_info>("user.refresh")
			commands.emit<cmd.data.refreshRoot>("data.refresh-root")
		})
	}, [commands, isAuthenticated])

	// Register showing custom CommandPalette.
	useEffect(() => {
		fromNullableE(customCommandPalette)
			.pipe(chainE(checkHasPinnedItemsE))
			.fold(noop, showCustomCommandPalette(commands))
	}, [customCommandPalette, commands])
}

// --- Internal ---

const IGNORED_KEYS = ["Control", "Shift", "Alt", "Meta"]

type TCreateHotkeyStringFn = (event: KeyboardEvent, isApple: boolean) => string
const createHotkeyString: TCreateHotkeyStringFn = (event, isApple) => {
	let hotkey = ""

	if (event.altKey) hotkey += "meta+"
	if (event.ctrlKey) hotkey += isApple ? "ctrl+" : "mod+"
	if (event.metaKey) hotkey += "mod+"
	if (event.shiftKey) hotkey += "shift+"

	hotkey += event.code.replace("Key", "").toLocaleLowerCase()

	return hotkey
}

type TFindCommandByHotkeyIfCommandPaletteExistsFn = (
	cp: TCommandPaletteState | null,
) => (hotkey: string) => TEither<Client.CommandPalette.Item, null>
const findCommandByHotkeyIfCommandPaletteExistsE: TFindCommandByHotkeyIfCommandPaletteExistsFn =
	commandPalette => hotkey =>
		fromNullableE(commandPalette).pipe(
			chainE(globalCommandPaletteState =>
				fromNullableE(globalCommandPaletteState.items.find(c => c.accelerator === hotkey)),
			),
		)

type TExecuteCommandFn = (event: KeyboardEvent) => (cmd: Client.CommandPalette.Item) => void
const executeCommand: TExecuteCommandFn = event => command => {
	event.preventDefault()
	event.stopPropagation()

	command.on_select()
}

type THandleHotkeyFn = (params: {
	commandPalette: TCommandPaletteState | null
	isApple: boolean
}) => HotkeyCallback
const handleHotkey: THandleHotkeyFn =
	({ commandPalette, isApple }) =>
	event => {
		fromBooleanE(!IGNORED_KEYS.includes(event.key))
			.pipe(mapE(() => createHotkeyString(event, isApple)))
			.pipe(chainE(findCommandByHotkeyIfCommandPaletteExistsE(commandPalette)))
			.fold(noop, executeCommand(event))
	}

type TCheckHasPinnedItemsFn = (cp: TCommandPaletteState) => TEither<TCommandPaletteState, void>
const checkHasPinnedItemsE: TCheckHasPinnedItemsFn = cp =>
	fromBooleanE(
		cp.items.length > 0 || (!!cp.pinnedItems && cp.pinnedItems.length > 0) || !!cp.onNewItem,
		cp,
	)

type TShowCustomCommandPaletteFn = (
	commands: Client.Commands.Commands,
) => (cps: TCommandPaletteState) => void
const showCustomCommandPalette: TShowCustomCommandPaletteFn = commands => commandPaletteState =>
	commands.emit<cmd.modal.show>("modal.show", {
		Component: createCustomCommandPaletteComponent(commandPaletteState),
		// The onHide hook makes a redundant call for hiding modal, but helps with closing the
		// command palette when the modal is closed with a click on the overlay or Esc key press.
		options: {
			show_close_button: false,
			on_hide: () => commands.emit<cmd.command_palette.hide>("command-palette.hide"),
		},
	})

type TCreateCustomCommandPaletteComponentFn = (cps: TCommandPaletteState) => ComponentType
const createCustomCommandPaletteComponent: TCreateCustomCommandPaletteComponentFn =
	commandPaletteState => {
		// Providing custom name to the component for transparency.
		return function CustomCommandPalette() {
			return (
				<CommandPaletteModal
					items={commandPaletteState.items}
					onNewItem={commandPaletteState.onNewItem}
					multiple={commandPaletteState.multiple}
					pinnedItems={commandPaletteState.pinnedItems}
				/>
			)
		}
	}
