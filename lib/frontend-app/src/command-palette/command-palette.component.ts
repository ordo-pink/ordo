import { Maoka, maoka, maoka_dom, maoka_styled } from "@ordo-pink/maoka"
import { bs_question_circle, bs_search } from "@ordo-pink/frontend-icons"
import { create_hotkey_from_event } from "@ordo-pink/hotkey-from-event"
import { maoka_jabs } from "@ordo-pink/maoka-jabs"
import { sweech } from "@ordo-pink/sweech"
import { title_case } from "@ordo-pink/tau"

import { app_context } from "../../app-context"
import { command_palette$ } from "./command-palette.state"

export const command_palette = () => internal.overlay(internal.modal)

// TODO Move accepting args to maoka
namespace internal {
	export const overlay: Maoka.Teacher = kindergarten =>
		styled.overlay(use => {
			const { hunter } = use(app_context.consume)

			const handle_show = () => use(maoka_jabs.add_class("active"))
			const handle_hide = () => use(maoka_jabs.remove_class("active"))
			const handle_click = () => hunter.shoot("command_palette.hide")
			const handle_mount = () => command_palette$.cheat("current", current => (current ? handle_show() : handle_hide()))

			use(maoka_dom.jabs.onmount(handle_mount))
			use(maoka_jabs.listen("onclick", handle_click))

			return kindergarten
		})

	export const modal = () =>
		styled.modal(use => {
			const get_current = use(maoka_jabs.cheat$(command_palette$, "current" as const))
			const { hunter } = use(app_context.consume)

			const handle_click = (event: MouseEvent) => event.stopPropagation()

			use(maoka_jabs.listen_global_event("keydown", e => e.code === "Escape" && hunter.shoot("command_palette.hide")))
			use(maoka_jabs.set_id("cp"))
			use(maoka_jabs.listen("onclick", handle_click))

			return () => {
				const current = get_current()

				if (!current) return null

				return [
					// TODO clean up here
					// TODO fix maoka_styled type inference for fn provision
					// TODO allow to return kindergarten directly in maoka_styled
					maoka.create("label", use => {
						use(maoka_jabs.set_class("command-palette_search_wrapper"))

						return () => [bs_search(), search()]
					}),
					// TODO open via route fragment and query
					// TODO create subitems if item is found with fuzzy search but the match is not exact
					current.is_multiple
						? items_wrapper(() => [items(() => current.items.map(item)), items(() => current.pinned_items?.map(item))])
						: items(() => current.items.map(item)),
					// TODO clean up here
					styled.footer(() => () => [
						bs_question_circle("mr-2"),
						"Type to search. Arrows to navigate.",
						hotkey("enter"),
						"to select item.",
						hotkey("escape"),
						"to close.",
					]),
				]
			}
		})

	const item = (item: Ordo.CommandPalette.Item) =>
		styled.item(use => {
			const handle_click = () => item.value()

			use(maoka_jabs.set_id(String(item.id)))
			use(maoka_jabs.set_attribute("title", item.description))
			use(maoka_jabs.listen("onclick", handle_click))

			return () => [
				item_main(() => [
					styled.item_title_wrapper(() => () => [item.render_icon && item_icon_span(item.render_icon), item.readable_name]),
					item.hotkey && styled.item_info(() => () => hotkey(item.hotkey!, { decoration_only: true })),
				]),
				item_footer(() => item.description),
			]
		})

	const item_main: Maoka.Teacher = kindergarten => styled.item_main(() => kindergarten)

	const item_footer: Maoka.Teacher = kindergarten => styled.item_footer(() => kindergarten)

	const item_icon_span = (render_icon: Ordo.CommandPalette.RenderIcon) =>
		maoka.create("span", use => use(maoka_dom.jabs.if_dom(n => void render_icon(n.value))))

	const search = () =>
		styled.item_input(use => {
			const t_search = "Search..." // TODO i18n

			const handle_mount = () => use(maoka_dom.jabs.if_dom(n => n.value.focus()))

			use(maoka_dom.jabs.onmount(handle_mount))
			use(maoka_jabs.set_id("cp-input"))
			use(maoka_jabs.set_attribute("placeholder", t_search))
			use(maoka_jabs.set_attribute("autocomplete", "off"))
		})

	const items_wrapper: Maoka.Teacher = kindergarten => styled.items_wrapper(() => kindergarten)

	const items: Maoka.Teacher = kindergarten => styled.items(() => kindergarten)

	namespace styled {
		export const items_wrapper = maoka_styled.div("command-palette_items_multiple-wrapper")
		export const items = maoka_styled.div("command-palette_items")
		export const item = maoka_styled.div("command-palette_item")
		export const item_info = maoka_styled.div("command-palette_item_info")
		export const item_title_wrapper = maoka_styled.div("command-palette_item_title-wrapper")
		export const item_main = maoka_styled.div("command-palette_item_main")
		export const item_footer = maoka_styled.div("command-palette_item_footer")
		export const item_input = maoka_styled.input("command-palette_search")
		export const modal = maoka_styled.div("command-palette")
		export const overlay = maoka_styled.div("command-palette_wrapper")
		export const footer = maoka_styled.div("command-palette_footer")
	}
}

// TODO Move to core

export type HotkeyOptions = {
	prevent_in_inputs?: boolean
	prevent_in_contenteditable?: boolean
	decoration_only?: boolean
	show_in_mobile?: boolean
}

const hotkey = (hotkey: string, options?: HotkeyOptions) =>
	hotkey_div((use, node) => {
		const is_darwin = use(maoka_jabs.is_darwin)
		if (!options?.decoration_only) use(maoka_jabs.listen_global_event("keydown", e => handle_keydown(e)))
		if (options?.show_in_mobile) use(maoka_jabs.add_class("mobile"))

		const split = hotkey.split("+")
		const meta = is_darwin ? Key("⌥") : Key("Alt")
		const mod = is_darwin ? Key("⌘") : Key("Ctrl")
		const ctrl = Key("Ctrl")
		const option = Key("⌥")
		const shift = Key("⇧")
		const symbol = split[split.length - 1].toLowerCase()

		const handle_keydown = (e: KeyboardEvent) => {
			if (IGNORED_KEYS.includes(e.key) || options?.decoration_only) return

			if (options?.prevent_in_inputs) {
				const target = e.target as HTMLElement

				// TODO Add textarea and div contenteditable
				if (target.tagName === "INPUT") return
			}

			const parsed_hotkey = create_hotkey_from_event(e, is_darwin)

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

			Key(symbol),
		]
	})

const hotkey_div = maoka_styled.div("hotkey")

const IGNORED_KEYS = ["Control", "Shift", "Alt", "Meta"]

const KeyContainer = maoka_styled.span("key-container")

const Key = (key: string) =>
	KeyContainer(
		() => () =>
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
				.default(() => title_case(key)),
	)
