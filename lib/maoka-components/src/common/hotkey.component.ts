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

import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { Result } from "@ordo-pink/result"
import { Switch } from "@ordo-pink/switch"

import "./hotkey.css"

// TODO Move to jabs
const isDarwin = navigator.appVersion.indexOf("Mac") !== -1

export const Hotkey = (accelerator: string) =>
	Maoka.create("div", ({ use, on_unmount, element }) => {
		const split = accelerator.split("+")

		const symbol = split[split.length - 1].toLowerCase()

		use(MaokaJabs.set_class("hotkey"))

		const handle_keydown = (event: KeyboardEvent) => {
			if (IGNORED_KEYS.includes(event.key)) return

			const hotkey = create_hotkey_string(event, false)

			if (hotkey === accelerator) {
				event.preventDefault()
				event.stopPropagation()

				if (element instanceof HTMLElement) element.click()
			}
		}

		document.addEventListener("keydown", handle_keydown)

		on_unmount(() => {
			document.removeEventListener("keydown", handle_keydown)
		})

		return () => [
			Result.If(split.includes("ctrl")).cata(Result.catas.if_ok(() => ctrl)),
			Result.If(split.includes("meta")).cata(Result.catas.if_ok(() => meta)),
			Result.If(split.includes("option")).cata(Result.catas.if_ok(() => option)),
			Result.If(split.includes("mod")).cata(Result.catas.if_ok(() => mod)),
			Result.If(split.includes("shift")).cata(Result.catas.if_ok(() => shift)),

			Key(symbol),
		]
	})

const IGNORED_KEYS = ["Control", "Shift", "Alt", "Meta"]

const create_hotkey_string = (event: KeyboardEvent, isApple: boolean) => {
	let hotkey = ""

	if (event.altKey) hotkey += "meta+"
	if (event.ctrlKey) hotkey += isApple ? "ctrl+" : "mod+"
	if (event.metaKey) hotkey += "mod+"
	if (event.shiftKey) hotkey += "shift+"

	hotkey += event.key.toLocaleLowerCase()

	return hotkey
}

const KeyContainer = Maoka.styled("span", {
	class: "key-container",
})

const Key = (key: string) =>
	KeyContainer(() =>
		Switch.Match(key)
			.case("backspace", () => "⌫")
			.case("enter", () => "⏎")
			.case("escape", () => "Esc")
			.default(() => key.toLocaleUpperCase()),
	)

const meta = isDarwin ? Key("⌥") : Key("Alt")
const mod = isDarwin ? Key("⌘") : Key("Ctrl")
const ctrl = Key("Ctrl")
const option = Key("⌥")
const shift = Key("⇧")
