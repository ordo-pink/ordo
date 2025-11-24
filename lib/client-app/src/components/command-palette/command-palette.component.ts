/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { type Maoka, maoka } from "@ordo-pink/oss-maoka"
import { bs_menu_button_wide_fill, bs_question_circle, bs_search } from "@ordo-pink/frontend-icons"
import { maoka_dom } from "@ordo-pink/oss-maoka/dom"
import { maoka_styled } from "@ordo-pink/oss-maoka-styled"
import { zags } from "@ordo-pink/oss-zags"

import "./command-palette.styles.css"

export const command_palette = maoka.create("div", ({ use }) => {
	const { hunter } = use(ordo_client_maoka.context.consume)

	const handle_click = () => hunter.shoot("command_palette.hide")

	const handle_add: OrdoClient.Command.GunFor<"command_palette.add"> = new_item =>
		$.update("items", items => (items.some(item => item.id === new_item.id) ? items : [...items, new_item]))
	const handle_remove: OrdoClient.Command.GunFor<"command_palette.remove"> = id =>
		$.update("items", items => items.filter(item => item.id !== id))
	const handle_show: OrdoClient.Command.GunFor<"command_palette.show"> = state =>
		$.update("current", () => state ?? global_palette())
	const handle_hide: OrdoClient.Command.GunFor<"command_palette.hide"> = () =>
		$.each({ current: () => void 0, index: () => 0, location: () => SECTION.ITEMS, search_value: () => "" })
	const handle_toggle: OrdoClient.Command.GunFor<"command_palette.toggle"> = () =>
		$.update("current", current_state => (current_state ? void 0 : global_palette()))

	const handle_toggle_cp_select = () => hunter.shoot("command_palette.toggle")
	const render_toggle_cp_icon: OrdoClient.CommandPalette.RenderIcon = span =>
		maoka_dom.render(span, bs_menu_button_wide_fill(), () => crypto.randomUUID())
	const toggle_params = {
		hotkey: "meta+shift+p",
		render_icon: render_toggle_cp_icon,
		type: ITEM_TYPE.MODAL_OPENER,
		description: "cp_toggle_desc",
	}

	const handle_mount = () =>
		$.cheat("current", current => {
			if (current) use(ordo_client_maoka.jabs.add_class("active"))
			else use(ordo_client_maoka.jabs.remove_class("active"))
		})

	use(maoka_dom.jabs.onmount(handle_mount))
	use(ordo_client_maoka.jabs.set_id("cp-overlay"))
	use(ordo_client_maoka.jabs.listen("onclick", handle_click))
	use(ordo_client_maoka.jabs.handle_command("command_palette.add", handle_add))
	use(ordo_client_maoka.jabs.handle_command("command_palette.remove", handle_remove))
	use(ordo_client_maoka.jabs.handle_command("command_palette.show", handle_show))
	use(ordo_client_maoka.jabs.handle_command("command_palette.hide", handle_hide))
	use(ordo_client_maoka.jabs.handle_command("command_palette.toggle", handle_toggle))
	use(ordo_client_maoka.jabs.add_translations("en", en))
	use(ordo_client_maoka.jabs.add_command_palette_item("cp_toggle_name", handle_toggle_cp_select, toggle_params))

	return command_palette_modal
})

export const command_palette_toggle = maoka.create("div", ({ use }) => {
	const { hunter } = use(ordo_client_maoka.context.consume)

	const handle_click = (event: MouseEvent) => {
		event.preventDefault()
		hunter.shoot("command_palette.toggle")
	}

	const handle_keydown = (event: KeyboardEvent) => {
		if (event.code === "Enter") {
			event.stopPropagation()
			hunter.shoot("command_palette.toggle")
		}
	}

	use(ordo_client_maoka.jabs.set_class("icon"))
	use(ordo_client_maoka.jabs.set_attribute("tabindex", "1"))
	use(ordo_client_maoka.jabs.listen("onclick", handle_click))
	use(ordo_client_maoka.jabs.listen("onkeydown", handle_keydown))

	return bs_menu_button_wide_fill
})

// --- Internal ---

const { SECTION, ITEM_TYPE, FUZZY_CHECK_RATIO } = ORDO_CLIENT.COMMAND_PALETTE

const IGNORED_KEYS = ["Control", "Shift", "Alt", "Meta"]

const global_palette = (): OrdoClient.CommandPalette.Instance<() => void> => ({
	items: $.select("items"),
	on_select: item => item.value(),
})

const $ = zags.create<{
	current?: OrdoClient.CommandPalette.Instance
	visible_items?: OrdoClient.CommandPalette.Item[]
	items: OrdoClient.CommandPalette.Item[]
	location: OrdoClient.CommandPalette.Section
	index: number
	search_value: string
}>({ index: 0, items: [], location: SECTION.ITEMS, search_value: "" })

const command_palette_modal = maoka.create("div", ({ use }) => {
	const { hunter } = use(ordo_client_maoka.context.consume)
	const is_darwin = use(ordo_client_maoka.jabs.is_darwin)
	const is_mobile = use(ordo_client_maoka.jabs.is_mobile)
	const translate = use(ordo_client_maoka.jabs.translate$)
	const get_current = use(ordo_client_maoka.jabs.cheat$($, "current"))

	const handle_click = (event: MouseEvent) => event.stopPropagation()
	const handle_global_keydown = (event: KeyboardEvent) => {
		if (IGNORED_KEYS.includes(event.key)) return

		const current = get_current()

		if (current && event.code === "Escape") return void hunter.shoot("command_palette.hide")

		const parsed_hotkey = ordo_client.fns.create_hotkey_from_event(event, is_darwin)

		if (current) {
			const filtered_items = current.items.filter(i =>
				ordo.fns.fuzzy_check(i.readable_name, $.select("search_value"), FUZZY_CHECK_RATIO),
			)

			if (current.is_multiple && event.code === "Tab")
				return $.update("location", l => (l === SECTION.ITEMS ? SECTION.PINNED_ITEMS : SECTION.ITEMS))
			else if (event.code === "ArrowDown") {
				event.preventDefault()
				return $.update("index", i => (i >= filtered_items.length - 1 ? 0 : i + 1))
			} else if (event.code === "ArrowUp") {
				event.preventDefault()
				return $.update("index", i => (i <= 0 ? filtered_items.length - 1 : i - 1))
			} else if (event.code === "Enter") {
				current.on_select(filtered_items[$.select("index")])
				hunter.shoot("command_palette.hide")
			}

			for (let i = 0; i < current.items.length; i++) {
				const item = current.items[i]

				if (parsed_hotkey === item.hotkey) {
					event.preventDefault()
					current.on_select(item)
					hunter.shoot("command_palette.hide")
					break
				}
			}
		} else {
			const global_items = $.select("items")

			for (let i = 0; i < global_items.length; i++) {
				const item = global_items[i]

				if (parsed_hotkey === item.hotkey) {
					event.preventDefault()
					item.value()
					break
				}
			}
		}
	}

	use(ordo_client_maoka.jabs.set_id("cp"))
	use(ordo_client_maoka.jabs.listen("onclick", handle_click))
	use(ordo_client_maoka.jabs.listen_global_event("keydown", handle_global_keydown))

	return () => {
		const current = get_current() ?? null

		return (
			current && [
				command_palette_search(),

				command_palette_items(),

				is_mobile
					? void 0
					: footer(() => [
							bs_question_circle({ classes: "mr-2" }),
							text_span(() => translate("cp_hint_1")),
							ordo_client_maoka.components.actionable_hotkey({ hotkey: "enter", decoration_only: true }),
							text_span(() => translate("cp_hint_2")),
							ordo_client_maoka.components.actionable_hotkey({ hotkey: "escape", decoration_only: true }),
							text_span(() => translate("cp_hint_3")),
						]),
			]
		)
	}
})

const command_palette_items = maoka.create("div", ({ use }) => {
	const get_state = use(ordo_client_maoka.jabs.marry$($))

	use(ordo_client_maoka.jabs.set_class("items_multiple-wrapper"))

	return () => {
		const state = get_state()

		if (!state.current) return null

		const visible_items = state.current.items.filter(item =>
			ordo.fns.fuzzy_check(item.readable_name, state.search_value, FUZZY_CHECK_RATIO),
		)

		if (!visible_items.length) return nothing_found_div(() => `Nothing matches the search term "${state.search_value}"`)

		if (!state.current.is_multiple)
			return items(() => visible_items.map((item, index) => command_palette_item({ active: state.index === index, item })))

		return [
			items(() =>
				state.items.map((item, index) =>
					command_palette_item({
						active: state.location === SECTION.ITEMS && state.index === index,
						item,
					}),
				),
			),
			items(() =>
				state.current!.pinned_items?.map((item, index) =>
					command_palette_item({
						active: state.location === SECTION.PINNED_ITEMS && state.index === index,
						item,
					}),
				),
			),
		]
	}
})

type CommandPaletteItemArgs = { item: OrdoClient.CommandPalette.Item; active: boolean }
const command_palette_item = maoka.create<CommandPaletteItemArgs>("div", ({ active, item, use }) => {
	const { hunter } = use(ordo_client_maoka.context.consume)
	const translate = use(ordo_client_maoka.jabs.translate$)

	const handle_click = () => {
		hunter.shoot("command_palette.hide")
		item.value()
	}

	const handle_onmount = (node: Maoka.Node<HTMLElement>) => {
		if (active && !is_in_view(node.value, node.value.parentElement!))
			node.value.scrollIntoView({ behavior: "smooth", inline: "center", block: "center" })
	}

	use(ordo_client_maoka.jabs.set_id(String(item.id)))
	use(ordo_client_maoka.jabs.set_class("item"))
	use(ordo_client_maoka.jabs.listen("onclick", handle_click))
	use(maoka_dom.jabs.onmount(handle_onmount))

	if (active) use(ordo_client_maoka.jabs.add_class("active"))
	else use(ordo_client_maoka.jabs.remove_class("active"))

	return () => {
		const t_description = translate(item.description)

		use(ordo_client_maoka.jabs.set_attribute("title", t_description))

		return [
			item_main(() => [
				item_title(() => [item.render_icon && item_icon({ render: item.render_icon }), translate(item.readable_name)]),
				item.hotkey &&
					item_info(() => ordo_client_maoka.components.actionable_hotkey({ hotkey: item.hotkey!, decoration_only: true })),
			]),
			item_footer(() => translate(item.description)),
		]
	}
})

const command_palette_search = maoka.create("label", ({ use }) => {
	use(ordo_client_maoka.jabs.set_class("search_wrapper"))

	return () => [bs_search(), search()]
})

const search = maoka_styled.input("search", ({ use }) => {
	const translate = use(ordo_client_maoka.jabs.translate$)

	const handle_onmount = () => use(maoka_dom.jabs.if_dom(n => n.value.focus()))
	const handle_input = (event: Event) => {
		const target = event.target as HTMLInputElement
		$.update("search_value", () => target.value)
	}

	use(ordo_client_maoka.jabs.set_id("cp-input"))
	use(ordo_client_maoka.jabs.set_attribute("autocomplete", "off"))
	use(ordo_client_maoka.jabs.set_attribute("value", $.select("search_value")))
	use(ordo_client_maoka.jabs.listen("oninput", handle_input))
	use(ordo_client_maoka.jabs.set_attribute("placeholder", translate("cp_search_placeholder")))
	use(maoka_dom.jabs.onmount(handle_onmount))

	return () => {
		use(ordo_client_maoka.jabs.set_attribute("placeholder", translate("cp_search_placeholder")))
	}
})

type ItemIconArgs = { render: OrdoClient.CommandPalette.RenderIcon }
const item_icon = maoka_styled.span<ItemIconArgs>("icon", ({ render, use }) => {
	use(maoka_dom.jabs.if_dom(n => void render(n.value)))
})

const item_title = maoka_styled.div("title-wrapper")
const item_info = maoka_styled.div("info")
const item_main = maoka_styled.div("main")
const item_footer = maoka_styled.div("footer")
const text_span = maoka_styled.span()
const footer = maoka_styled.div("footer")
const items = maoka_styled.div("items")
const nothing_found_div = maoka_styled.div("nothing-found")

const is_in_view = (element: Element, wrapper: Element) => {
	const { left, top, bottom, right } = element.getBoundingClientRect()

	return top >= 0 && left >= 0 && bottom <= wrapper?.clientHeight && right <= wrapper?.clientWidth
}

const en = {
	cp_toggle_name: "Toggle Command Palette",
	cp_toggle_desc: "Show or hide Command Palette. If you see this, it is most probably opened.",
	cp_hint_1: "Type to search. Arrows to navigate.",
	cp_hint_2: "to select item.",
	cp_hint_3: "to close.",
	cp_search_placeholder: "Search...",
}
