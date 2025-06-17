/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { RRR } from "@ordo-pink/sdk-core"
import { sweech } from "@ordo-pink/sweech"

import type { ClientRrr, ClientSDK } from "./sdk-client.types"

export namespace client_sdk {
	export const create_hotkey_from_event: ClientSDK.CreateHotkeyFromEvent = (event, is_darwin) => {
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

export namespace client_rrr {
	export const create: ClientRrr.CreateType =
		type =>
		(message, ...debug) => ({ type: RRR.TYPE[type], message, debug })

	export const eacces = create("EACCES")
	export const eagain = create("EAGAIN")
	export const eexist = create("EEXIST")
	export const efbig = create("EFBIG")
	export const eintr = create("EINTR")
	export const einval = create("EINVAL")
	export const eio = create("EIO")
	export const enoent = create("ENOENT")
	export const enospc = create("ENOSPC")
	export const enxio = create("ENXIO")
	export const eperm = create("EPERM")
	export const eunknown = create("EUNKNOWN")
}
