/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import * as maoka from "@ordo-pink/oss-maoka"
import { client_maoka } from "@ordo-pink/sdk-client-maoka"
import { client_sdk } from "@ordo-pink/sdk-client"
import { sweech } from "@ordo-pink/oss-sweech"
import { title_case } from "@ordo-pink/_tau"

import type * as ClientMaoka from "../sdk-client-maoka.types"

import "./hotkey.styles.css"

export const actionable_hotkey = maoka.create_component<ClientMaoka.Components.HotkeyArgs>(
	"div",
	({ decoration_only, hotkey, node, prevent_in_contenteditable, prevent_in_inputs, show_in_mobile, use }) => {
		const is_darwin = use(client_maoka.jabs.is_darwin)

		use(client_maoka.jabs.classes.set("hotkey"))
		if (show_in_mobile) use(client_maoka.jabs.classes.add("mobile"))
		if (!decoration_only) use(client_maoka.jabs.listen_global_event("keydown", e => handle_keydown(e)))

		const split = hotkey.split("+")
		const meta = is_darwin ? hotkey_button({ key: "⌥" }) : hotkey_button({ key: "Alt" })
		const mod = is_darwin ? hotkey_button({ key: "⌘" }) : hotkey_button({ key: "Ctrl" })
		const ctrl = hotkey_button({ key: "Ctrl" })
		const option = hotkey_button({ key: "⌥" })
		const shift = hotkey_button({ key: "⇧" })
		const key = split[split.length - 1].toLowerCase()

		const handle_keydown = (e: KeyboardEvent) => {
			if (IGNORED_KEYS.includes(e.key) || decoration_only) return
			const target = e.target as HTMLElement

			if (prevent_in_inputs && target.tagName === "INPUT") return
			if (prevent_in_contenteditable && target.tagName === "DIV" && target.contentEditable) return

			const parsed_hotkey = client_sdk.create_hotkey_from_event(e, is_darwin)

			// TODO Accept handler

			if (parsed_hotkey === hotkey) {
				e.preventDefault()

				if (node.value instanceof globalThis.HTMLElement) node.value.click()
			}
		}

		return () => [
			split.includes("ctrl") ? ctrl : void 0,
			split.includes("meta") ? meta : void 0,
			split.includes("option") ? option : void 0,
			split.includes("mod") ? mod : void 0,
			split.includes("shift") ? shift : void 0,

			hotkey_button({ key }),
		]
	},
)

// --- Internal ---

const IGNORED_KEYS = ["Control", "Shift", "Alt", "Meta"]

const hotkey_button = maoka.create_component<{ key: string }>("kbd", ({ use, key }) => {
	use(client_maoka.jabs.classes.set("key-container"))

	return () =>
		sweech
			.match(key)
			.case("backspace", () => "⌫")
			.case("enter", () => "⏎")
			.case("escape", () => "Esc")
			.case("tab", () => "⇥")
			.case("arrowleft", () => "←")
			.case("arrowright", () => "→")
			.case("arrowup", () => "↑")
			.case("arrowdown", () => "↓")
			.default(() => title_case(key))
})
