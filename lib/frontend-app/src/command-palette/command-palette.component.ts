import { bs_question_circle, bs_search } from "@ordo-pink/frontend-icons"
import { is_string, title_case } from "@ordo-pink/tau"
import { maoka, maoka_dom } from "@ordo-pink/maoka"
import { create_hotkey_from_event } from "@ordo-pink/hotkey-from-event"
import { maoka_jabs } from "@ordo-pink/maoka-jabs"
import { sweech } from "@ordo-pink/sweech"

import { app_context } from "../../app-context"
import { command_palette$ } from "./command-palette.state"

export const command_palette = () => internal.overlay({ kindergarten: () => internal.modal({}) })

namespace internal {
	export const overlay = maoka.create("div", ({ kindergarten, use }) => {
		const { hunter } = use(app_context.consume)

		const handle_show = () => use(maoka_jabs.add_class("active"))
		const handle_hide = () => use(maoka_jabs.remove_class("active"))
		const handle_click = () => hunter.shoot("command_palette.hide")
		const handle_mount = () => command_palette$.cheat("current", current => (current ? handle_show() : handle_hide()))

		use(maoka_jabs.set_class("command-palette_wrapper"))
		use(maoka_dom.jabs.onmount(handle_mount))
		use(maoka_jabs.listen("onclick", handle_click))

		return kindergarten
	})

	export const modal = maoka.create("div", ({ use }) => {
		const get_current = use(maoka_jabs.cheat$(command_palette$, "current" as const))
		const { hunter } = use(app_context.consume)

		const handle_click = (event: MouseEvent) => event.stopPropagation()

		use(maoka_jabs.set_class("command-palette"))
		use(maoka_jabs.listen_global_event("keydown", e => e.code === "Escape" && hunter.shoot("command_palette.hide")))
		use(maoka_jabs.set_id("cp"))
		use(maoka_jabs.listen("onclick", handle_click))

		return () => {
			const current = get_current()

			if (!current) return null

			return [
				// TODO clean up here
				maoka.create("label", ({ use }) => {
					use(maoka_jabs.set_class("command-palette_search_wrapper"))

					return () => [bs_search({}), search({})]
				})({}),
				// TODO open via route fragment and query
				// TODO create subitems if item is found with fuzzy search but the match is not exact
				current.is_multiple
					? items_wrapper({
							kindergarten: () => [
								items({ kindergarten: () => current.items.map(item => list_item({ item })) }),
								items({ kindergarten: () => current.pinned_items?.map(item => list_item({ item })) }),
							],
						})
					: items({ kindergarten: () => current.items.map(item => list_item({ item })) }),
				// TODO clean up here
				maoka.create("div", ({ use }) => {
					use(maoka_jabs.set_class("command-palette_footer"))

					return () => [
						bs_question_circle({ classes: "mr-2" }),
						"Type to search. Arrows to navigate.",
						hotkey({ hotkey: "enter", decoration_only: true }),
						"to select item.",
						hotkey({ hotkey: "escape", decoration_only: true }),
						"to close.",
					]
				})({}), // TODO Automatically provide empty args?
			]
		}
	})

	const list_item = maoka.create<{ item: Ordo.CommandPalette.Item }>("div", ({ item, use }) => {
		const handle_click = () => item.value()

		use(maoka_jabs.set_class("command-palette_item"))
		use(maoka_jabs.set_id(String(item.id)))
		use(maoka_jabs.set_attribute("title", item.description))
		use(maoka_jabs.listen("onclick", handle_click))

		return () => [
			// TODO Shortcut for providing kindergarten directly
			item_main({
				kindergarten: () => [
					maoka.create("div", ({ use }) => {
						use(maoka_jabs.set_class("command-palette_item_title-wrapper"))

						return () => [item.render_icon && item_icon_span({ render: item.render_icon }), item.readable_name]
					})({}),
					item.hotkey &&
						maoka.create("div", ({ use }) => {
							use(maoka_jabs.set_class("command-palette_item_info"))

							return () => hotkey({ hotkey: item.hotkey!, decoration_only: true })
						})({}),
				],
			}),
			item_footer({ kindergarten: () => item.description }),
		]
	})

	// TODO Styled
	const item_main = maoka.create("div", ({ kindergarten, use }) => {
		use(maoka_jabs.set_class("command-palette_item_main"))

		return kindergarten
	})

	const item_footer = maoka.create("div", ({ kindergarten, use }) => {
		use(maoka_jabs.set_class("command-palette_item_footer"))

		return kindergarten
	})

	const item_icon_span = maoka.create<{ render: Ordo.CommandPalette.RenderIcon }>("span", ({ render, use }) =>
		use(maoka_dom.jabs.if_dom(n => void render(n.value))),
	)

	const search = maoka.create("input", ({ use }) => {
		const t_search = "Search..." // TODO i18n

		const handle_mount = () => use(maoka_dom.jabs.if_dom(n => n.value.focus()))

		use(maoka_jabs.set_class("command-palette_search"))
		use(maoka_dom.jabs.onmount(handle_mount))
		use(maoka_jabs.set_id("cp-input"))
		use(maoka_jabs.set_attribute("placeholder", t_search))
		use(maoka_jabs.set_attribute("autocomplete", "off"))
	})

	const items_wrapper = maoka.create("div", ({ kindergarten, use }) => {
		use(maoka_jabs.set_class("command-palette_items_multiple-wrapper"))

		return kindergarten
	})

	const items = maoka.create("div", ({ kindergarten, use }) => {
		use(maoka_jabs.set_class("command-palette_items"))

		return kindergarten
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
		if (!decoration_only) use(maoka_jabs.listen_global_event("keydown", e => handle_keydown(e)))
		if (show_in_mobile) use(maoka_jabs.add_class("mobile"))

		const split = hotkey.split("+")
		const meta = is_darwin ? Key({ kindergarten: () => "⌥" }) : Key({ kindergarten: () => "Alt" })
		const mod = is_darwin ? Key({ kindergarten: () => "⌘" }) : Key({ kindergarten: () => "Ctrl" })
		const ctrl = Key({ kindergarten: () => "Ctrl" })
		const option = Key({ kindergarten: () => "⌥" })
		const shift = Key({ kindergarten: () => "⇧" })
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

			Key({ kindergarten: () => symbol }),
		]
	},
)

const IGNORED_KEYS = ["Control", "Shift", "Alt", "Meta"]

const Key = maoka.create("span", ({ use, kindergarten }) => {
	use(maoka_jabs.set_class("key-container"))

	const key = kindergarten?.() ?? ""

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
			.case(is_string, () => title_case(key as string))
			.default(() => key)
})
