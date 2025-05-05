import { bs_question_circle, bs_search } from "@ordo-pink/frontend-icons"
import { maoka, maoka_dom, maoka_styled } from "@ordo-pink/maoka"
import { create_hotkey_from_event } from "@ordo-pink/hotkey-from-event"
import { maoka_jabs } from "@ordo-pink/maoka-jabs"
import { sweech } from "@ordo-pink/sweech"
import { title_case } from "@ordo-pink/tau"

import { app_context } from "../../app-context"
import { command_palette$ } from "./command-palette.state"

export const command_palette = () => internal.overlay(internal.modal)

namespace internal {
	export const overlay = maoka.create("div", ({ kindergarten, use }) => {
		const { hunter } = use(app_context.consume)

		const handle_show = () => use(maoka_jabs.add_class("active"))
		const handle_hide = () => use(maoka_jabs.remove_class("active"))
		const handle_click = () => hunter.shoot("command_palette.hide")
		const handle_mount = () => command_palette$.cheat("current", current => (current ? handle_show() : handle_hide()))

		use(maoka_jabs.set_class("command-palette_wrapper"))
		use(maoka_jabs.listen("onclick", handle_click))
		use(maoka_dom.jabs.onmount(handle_mount))

		return kindergarten
	})

	export const modal = maoka.create("div", ({ use }) => {
		const is_darwin = use(maoka_jabs.is_darwin)
		const { hunter } = use(app_context.consume)
		const get_current = use(maoka_jabs.cheat$(command_palette$, "current" as const))

		const handle_click = (event: MouseEvent) => event.stopPropagation()
		const handle_global_keydown = (e: KeyboardEvent) => {
			if (e.code === "Escape") return void hunter.shoot("command_palette.hide")
			if (IGNORED_KEYS.includes(e.key)) return

			const parsed_hotkey = create_hotkey_from_event(e, is_darwin)
			const current = get_current()

			if (current) {
				for (let i = 0; i < current.items.length; i++) {
					const item = current.items[i]

					if (parsed_hotkey === item.hotkey) {
						e.preventDefault()
						current.on_select(item)
						break
					}
				}
			} else {
				const global_items = command_palette$.select("items")

				for (let i = 0; i < global_items.length; i++) {
					const item = global_items[i]

					if (parsed_hotkey === item.hotkey) {
						e.preventDefault()
						item.value()
						break
					}
				}
			}
		}

		use(maoka_jabs.set_id("cp"))
		use(maoka_jabs.set_class("command-palette"))
		use(maoka_jabs.listen("onclick", handle_click))
		use(maoka_jabs.listen_global_event("keydown", handle_global_keydown))

		return () => {
			const current = get_current()

			if (!current) return null

			return [
				// TODO clean up here
				search_label(() => [bs_search({ classes: "" }), search()]),
				// TODO open via route fragment and query
				// TODO create subitems if item is found with fuzzy search but the match is not exact
				current.is_multiple
					? items_wrapper(() => [
							items(() => current.items.map(item => list_item({ item }))),
							items(() => current.pinned_items?.map(item => list_item({ item }))),
						])
					: items(() => current.items.map(item => list_item({ item }))),
				footer(() => [
					bs_question_circle({ classes: "mr-2" }),
					text_span(() => "Type to search. Arrows to navigate."),
					hotkey({ hotkey: "enter", decoration_only: true }),
					text_span(() => "to select item."),
					hotkey({ hotkey: "escape", decoration_only: true }),
					text_span(() => "to close."),
				]),
			]
		}
	})

	const list_item = maoka.create<{ item: Ordo.CommandPalette.Item }>("div", ({ item, use }) => {
		const handle_click = () => item.value()

		use(maoka_jabs.set_id(String(item.id)))
		use(maoka_jabs.set_class("command-palette_item"))
		use(maoka_jabs.set_attribute("title", item.description))
		use(maoka_jabs.listen("onclick", handle_click))

		return () => [
			// TODO Shortcut for providing kindergarten directly
			item_main(() => [
				item_title(() => [item.render_icon && item_icon({ render: item.render_icon }), item.readable_name]),
				item.hotkey && item_info(() => hotkey({ hotkey: item.hotkey!, decoration_only: true })),
			]),
			item_footer(() => item.description),
		]
	})

	const search_label = maoka_styled.label("command-palette_search_wrapper")
	const text_span = maoka_styled.span("")
	const footer = maoka_styled.div("command-palette_footer")
	const item_title = maoka_styled.div("command-palette_item_title-wrapper")
	const item_info = maoka_styled.div("command-palette_item_info")
	const item_main = maoka_styled.div("command-palette_item_main")
	const items_wrapper = maoka_styled.div("command-palette_items_multiple-wrapper")
	const items = maoka_styled.div("command-palette_items")
	const item_footer = maoka_styled.div("command-palette_item_footer")
	const item_icon = maoka_styled.span<{ render: Ordo.CommandPalette.RenderIcon }>(
		"command-palette_item_icon",
		({ render, use }) => use(maoka_dom.jabs.if_dom(n => void render(n.value))),
	)

	const search = maoka_styled.input<void>("command-palette_search", ({ use }) => {
		const t_search = "Search..." // TODO i18n

		const handle_mount = () => use(maoka_dom.jabs.if_dom(n => n.value.focus()))

		use(maoka_jabs.set_id("cp-input"))
		use(maoka_jabs.set_attribute("placeholder", t_search))
		use(maoka_jabs.set_attribute("autocomplete", "off"))
		use(maoka_dom.jabs.onmount(handle_mount))
	})
}

// TODO Move to core

export type HotkeyOptions = {
	hotkey: string
	prevent_in_inputs?: boolean
	prevent_in_contenteditable?: boolean
	decoration_only?: boolean
	show_in_mobile?: boolean
}

const hotkey = maoka.create<HotkeyOptions>(
	"div",
	({ decoration_only, hotkey, node, prevent_in_contenteditable, prevent_in_inputs, show_in_mobile, use }) => {
		const is_darwin = use(maoka_jabs.is_darwin)

		use(maoka_jabs.set_class("hotkey"))
		if (show_in_mobile) use(maoka_jabs.add_class("mobile"))
		if (!decoration_only) use(maoka_jabs.listen_global_event("keydown", e => handle_keydown(e)))

		const split = hotkey.split("+")
		const meta = is_darwin ? hotkey_button({ key: "⌥" }) : hotkey_button({ key: "Alt" })
		const mod = is_darwin ? hotkey_button({ key: "⌘" }) : hotkey_button({ key: "Ctrl" })
		const ctrl = hotkey_button({ key: "Ctrl" })
		const option = hotkey_button({ key: "⌥" })
		const shift = hotkey_button({ key: "⇧" })
		const symbol = split[split.length - 1].toLowerCase()

		const handle_keydown = (e: KeyboardEvent) => {
			if (IGNORED_KEYS.includes(e.key) || decoration_only) return
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

			hotkey_button({ key: symbol }),
		]
	},
)

const IGNORED_KEYS = ["Control", "Shift", "Alt", "Meta"]

const hotkey_button = maoka.create<{ key: string }>("span", ({ use, key }) => {
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
