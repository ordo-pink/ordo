import { create_hotkey_from_event } from "@ordo-pink/hotkey-from-event"
import { maoka } from "@ordo-pink/maoka"
import { maoka_jabs } from "@ordo-pink/maoka-jabs"
import { sweech } from "@ordo-pink/sweech"
import { title_case } from "@ordo-pink/tau"

import "./hotkey.styles.css"

export type HotkeyOptions = {
	hotkey: string
	prevent_in_inputs?: boolean
	prevent_in_contenteditable?: boolean
	decoration_only?: boolean
	show_in_mobile?: boolean
}

export const hotkey = maoka.create<HotkeyOptions>(
	"div",
	({ decoration_only, hotkey, node, prevent_in_contenteditable, prevent_in_inputs, show_in_mobile, use }) => {
		const is_darwin = use(maoka_jabs.is_darwin)

		use(maoka_jabs.set_class("hotkey"))
		if (show_in_mobile) use(maoka_jabs.add_class("mobile"))
		if (!decoration_only) use(maoka_jabs.listen_global_event("keydown", e => handle_keydown(e)))

		const split = hotkey.split("+")
		const meta = is_darwin ? internal.hotkey_button({ key: "⌥" }) : internal.hotkey_button({ key: "Alt" })
		const mod = is_darwin ? internal.hotkey_button({ key: "⌘" }) : internal.hotkey_button({ key: "Ctrl" })
		const ctrl = internal.hotkey_button({ key: "Ctrl" })
		const option = internal.hotkey_button({ key: "⌥" })
		const shift = internal.hotkey_button({ key: "⇧" })
		const symbol = split[split.length - 1].toLowerCase()

		const handle_keydown = (e: KeyboardEvent) => {
			if (internal.IGNORED_KEYS.includes(e.key) || decoration_only) return
			const target = e.target as HTMLElement

			if (prevent_in_inputs && target.tagName === "INPUT") return
			if (prevent_in_contenteditable && target.tagName === "DIV" && target.contentEditable) return

			const parsed_hotkey = create_hotkey_from_event(e, is_darwin)

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

			internal.hotkey_button({ key: symbol }),
		]
	},
)

namespace internal {
	export const IGNORED_KEYS = ["Control", "Shift", "Alt", "Meta"]

	export const hotkey_button = maoka.create<{ key: string }>("span", ({ use, key }) => {
		use(maoka_jabs.set_class("key-container"))

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
}
