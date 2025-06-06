/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { sweech } from "@ordo-pink/sweech"

import type { Client } from "./sdk-client.types"

export namespace client {
	export const create_hotkey_from_event: Client.CreateHotkeyFromEvent = (event, is_darwin) => {
		let hotkey = ""

		if (event.altKey) hotkey += "meta+"
		if (event.ctrlKey) hotkey += is_darwin ? "ctrl+" : "mod+"
		if (event.metaKey) hotkey += "mod+"
		if (event.shiftKey) hotkey += "shift+"

		hotkey += sweech
			.match(event.code)
			.case("Period", () => ".")
			.case("Comma", () => ",")
			.case("Backquote", () => "`")
			.case("Minus", () => "-")
			.case("Backslash", () => "\\")
			.case("BracketLeft", () => "[")
			.case("BracketRight", () => "]")
			.case("Semicolon", () => ";")
			.case("Quote", () => "'")
			.case("Slash", () => "/")
			.case("Space", () => " ")
			.case(
				code => !code,
				() => "",
			)
			.case(
				code => code.startsWith("Key"),
				() => event.code.slice(3).toLowerCase(),
			)
			.case(
				code => code.startsWith("Digit"),
				() => event.code.slice(5),
			)
			.default(() => event.code.toLowerCase())

		return hotkey
	}
}
