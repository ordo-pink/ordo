/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2024  谢尔盖 ||↓ and the Ordo.pink contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { Result } from "@ordo-pink/result"
import { Switch } from "@ordo-pink/switch"
import { create_hotkey_from_event } from "@ordo-pink/hotkey-from-event"
import { title_case } from "@ordo-pink/tau"

import "./hotkey.css"

export type THotkeyOptions = {
	prevent_in_inputs?: boolean
	prevent_in_contenteditable?: boolean
	smol?: boolean
	decoration_only?: boolean
	show_in_mobile?: boolean
}

export const Hotkey = (
	hotkey: string,
	options: THotkeyOptions = {
		prevent_in_inputs: false,
		prevent_in_contenteditable: true,
		smol: false,
		decoration_only: false,
		show_in_mobile: false,
	},
) =>
	Maoka.create("div", ({ use, onunmount, element: element, onmount: after_mount }) => {
		use(MaokaJabs.set_class("hotkey"))
		if (options.smol) use(MaokaJabs.add_class("smol"))
		if (options.show_in_mobile) use(MaokaJabs.add_class("mobile"))
		const is_darwin = use(MaokaJabs.is_darwin)

		const split = hotkey.split("+")

		const meta = is_darwin ? Key("⌥") : Key("Alt")
		const mod = is_darwin ? Key("⌘") : Key("Ctrl")
		const ctrl = Key("Ctrl")
		const option = Key("⌥")
		const shift = Key("⇧")

		const symbol = split[split.length - 1].toLowerCase()

		const handle_keydown = (event: KeyboardEvent) => {
			if (IGNORED_KEYS.includes(event.key) || options.decoration_only) return

			if (options.prevent_in_inputs) {
				const target = event.target as HTMLElement

				// TODO Add textarea and div contenteditable
				if (target.tagName === "INPUT") return
			}

			const parsed_hotkey = create_hotkey_from_event(event, is_darwin)

			if (parsed_hotkey === hotkey) {
				event.preventDefault()

				if (element instanceof HTMLElement) element.click()
			}
		}

		after_mount(() => document.addEventListener("keydown", handle_keydown))
		onunmount(() => document.removeEventListener("keydown", handle_keydown))

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

const KeyContainer = Maoka.styled("span", {
	class: "key-container",
})

const Key = (key: string) =>
	KeyContainer(() =>
		Switch.Match(key)
			.case("backspace", () => "⌫")
			.case("enter", () => "⏎")
			.case("escape", () => "Esc")
			.case("tab", () => "⇥")
			.case("arrowleft", () => "←")
			.case("arrowright", () => "→")
			.case("arrowup", () => "↑")
			.case("arrowdown", () => "↓")
			.default(() => title_case(key)),
	)
