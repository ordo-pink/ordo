import { bs_menu_button_wide_fill, bs_question_circle, bs_search } from "@ordo-pink/frontend-icons"
import { maoka } from "@ordo-pink/oss-maoka"
import { maoka_dom } from "@ordo-pink/oss-maoka/dom"
import { maoka_styled } from "@ordo-pink/oss-maoka-styled"
import { zags } from "@ordo-pink/oss-zags"

import "./command-palette.styles.css"

export const command_palette = maoka.create("div", ({ use }) => {
	const { hunter } = use(ordo_client_maoka.context.consume)

	const handle_show = () => use(ordo_client_maoka.jabs.add_class("active"))
	const handle_hide = () => use(ordo_client_maoka.jabs.remove_class("active"))
	const handle_click = () => hunter.shoot("command_palette.hide")
	const handle_mount = () => {
		const divorce_current = $.cheat("current", current => (current ? handle_show() : handle_hide()))

		const release_add = hunter.track("command_palette.add", item =>
			$.update("items", items => (items.some(i => i.id === item.id) ? items : [...items, item])),
		)

		const release_hide = hunter.track("command_palette.hide", () => {
			$.each({
				current: () => void 0,
				index: () => 0,
				location: () => ORDO_CLIENT.COMMAND_PALETTE.SECTION.ITEMS,
				search_value: () => "",
			})
		})

		const release_remove = hunter.track("command_palette.remove", id =>
			$.update("items", items => items.filter(i => i.id !== id)),
		)

		const release_show = hunter.track("command_palette.show", new_current => {
			$.update("current", () => new_current ?? global_palette())
		})

		const release_toggle = hunter.track("command_palette.toggle", () => {
			$.update("current", current => {
				if (current) return
				return global_palette()
			})
		})

		hunter.shoot("i18n.add_translations", {
			locale: "en",
			values: {
				command_palette_name: "Command Palette",
				command_palette_commands_toggle_description:
					"Show or hide command palette. If you read this, doing this will hide the palette.",
				command_palette_commands_toggle_name: "Toggle Command Palette",
			},
		})

		hunter.shoot("command_palette.add", {
			description: "command_palette_commands_toggle_description",
			hotkey: "meta+shift+p",
			id: "command_palette.toggle",
			readable_name: "command_palette_commands_toggle_name",
			render_icon: span => maoka_dom.render(span, bs_menu_button_wide_fill(), () => crypto.randomUUID()),
			type: ORDO_CLIENT.COMMAND_PALETTE.ITEM_TYPE.MODAL_OPENER,
			value: () => hunter.shoot("command_palette.toggle"),
		})

		return () => {
			hunter.shoot("command_palette.remove", "command_palette.toggle")
			divorce_current()

			release_add()
			release_hide()
			release_remove()
			release_show()
			release_toggle()
		}
	}

	use(ordo_client_maoka.jabs.set_class("command-palette_wrapper"))
	use(ordo_client_maoka.jabs.listen("onclick", handle_click))
	use(maoka_dom.jabs.onmount(handle_mount))

	return () => command_palette_modal()
})

export const command_palette_toggle = maoka.create("div", ({ use, node }) => {
	const { hunter } = use(ordo_client_maoka.context.consume)

	const handle_click = (event: MouseEvent) => {
		event.preventDefault()
		hunter.shoot("command_palette.toggle")
	}
	const handle_keydown = (event: KeyboardEvent) => {
		if (maoka_dom.node_guard(node) && event.code === "Enter") {
			event.stopPropagation()
			hunter.shoot("command_palette.toggle")
		}
	}

	use(ordo_client_maoka.jabs.set_class("activity-bar_icon"))
	use(ordo_client_maoka.jabs.set_attribute("tabindex", "1"))
	use(ordo_client_maoka.jabs.listen("onclick", handle_click))
	use(ordo_client_maoka.jabs.listen("onkeydown", handle_keydown))

	return () => bs_menu_button_wide_fill()
})

// --- Internal ---

const command_palette_item = maoka.create<{ item: OrdoClient.CommandPalette.Item; active: boolean }>(
	"div",
	({ active, item, use }) => {
		const { hunter } = use(ordo_client_maoka.context.consume)

		const handle_click = () => {
			hunter.shoot("command_palette.hide")
			item.value()
		}
		const translate = use(ordo_client_maoka.jabs.translate$)

		use(ordo_client_maoka.jabs.set_id(String(item.id)))
		use(ordo_client_maoka.jabs.set_class("command-palette_item"))
		use(ordo_client_maoka.jabs.listen("onclick", handle_click))

		if (active) use(ordo_client_maoka.jabs.add_class("active"))
		else use(ordo_client_maoka.jabs.remove_class("active"))

		return () => {
			use(ordo_client_maoka.jabs.set_attribute("title", translate(item.description)))

			return [
				item_main(() => [
					item_title(() => [item.render_icon && item_icon({ render: item.render_icon }), translate(item.readable_name)]),
					item.hotkey &&
						item_info(() => ordo_client_maoka.components.actionable_hotkey({ hotkey: item.hotkey!, decoration_only: true })),
				]),
				item_footer(() => translate(item.description)),
			]
		}
	},
)

const $ = zags.create<{
	current?: OrdoClient.CommandPalette.Instance
	visible_items?: OrdoClient.CommandPalette.Item[]
	items: OrdoClient.CommandPalette.Item[]
	location: OrdoClient.CommandPalette.Section
	index: number
	search_value: string
}>({
	index: 0,
	items: [],
	location: ORDO_CLIENT.COMMAND_PALETTE.SECTION.ITEMS,
	search_value: "",
})

const command_palette_items = maoka.create("div", ({ use }) => {
	const get_state = use(ordo_client_maoka.jabs.marry$($))

	use(ordo_client_maoka.jabs.set_class("command-palette_items_multiple-wrapper"))

	return () => {
		const state = get_state()

		if (!state.current) return null

		const visible_items = state.current.items.filter(item =>
			ordo.fns.fuzzy_check(item.readable_name, state.search_value, ORDO_CLIENT.COMMAND_PALETTE.FUZZY_CHECK_RATIO),
		)

		if (!visible_items.length) return nothing_found_div(() => `Nothing matches the search term "${state.search_value}"`)

		if (!state.current.is_multiple)
			return items(() => visible_items.map((item, index) => command_palette_item({ active: state.index === index, item })))

		return [
			items(() =>
				state.items.map((item, index) =>
					command_palette_item({
						active: state.location === ORDO_CLIENT.COMMAND_PALETTE.SECTION.ITEMS && state.index === index,
						item,
					}),
				),
			),
			items(() =>
				state.current!.pinned_items?.map((item, index) =>
					command_palette_item({
						active: state.location === ORDO_CLIENT.COMMAND_PALETTE.SECTION.PINNED_ITEMS && state.index === index,
						item,
					}),
				),
			),
		]
	}
})

const command_palette_modal = maoka.create("div", ({ use }) => {
	const { hunter } = use(ordo_client_maoka.context.consume)
	const is_darwin = use(ordo_client_maoka.jabs.is_darwin)
	const is_mobile = use(ordo_client_maoka.jabs.is_mobile)

	const get_current = use(ordo_client_maoka.jabs.cheat$($, "current" as const))

	const handle_click = (event: MouseEvent) => event.stopPropagation()
	const handle_global_keydown = (event: KeyboardEvent) => {
		if (IGNORED_KEYS.includes(event.key)) return

		const current = get_current()

		if (current && event.code === "Escape") return void hunter.shoot("command_palette.hide")

		const parsed_hotkey = ordo_client.fns.create_hotkey_from_event(event, is_darwin)

		if (current) {
			const filtered_items = current.items.filter(i =>
				ordo.fns.fuzzy_check(i.readable_name, $.select("search_value"), ORDO_CLIENT.COMMAND_PALETTE.FUZZY_CHECK_RATIO),
			)

			if (current.is_multiple && event.code === "Tab")
				return $.update("location", l =>
					l === ORDO_CLIENT.COMMAND_PALETTE.SECTION.ITEMS
						? ORDO_CLIENT.COMMAND_PALETTE.SECTION.PINNED_ITEMS
						: ORDO_CLIENT.COMMAND_PALETTE.SECTION.ITEMS,
				)
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
	use(ordo_client_maoka.jabs.set_class("command-palette"))
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
							text_span(() => "Type to search. Arrows to navigate."), // TODO i18n
							ordo_client_maoka.components.actionable_hotkey({ hotkey: "enter", decoration_only: true }),
							text_span(() => "to select item."), // TODO i18n
							ordo_client_maoka.components.actionable_hotkey({ hotkey: "escape", decoration_only: true }),
							text_span(() => "to close."), // TODO i18n
						]),
			]
		)
	}
})

const command_palette_search = maoka.create("label", ({ use }) => {
	use(ordo_client_maoka.jabs.set_class("command-palette_search_wrapper"))

	return () => [bs_search({ classes: "" }), search()]
})

const search = maoka_styled.input("command-palette_search", ({ use }) => {
	const t_search = "Search..." // TODO i18n

	const handle_mount = () => use(maoka_dom.jabs.if_dom(n => n.value.focus()))
	const handle_input = (event: Event) => {
		const target = event.target as HTMLInputElement
		$.update("search_value", () => target.value)
	}

	use(ordo_client_maoka.jabs.set_id("cp-input"))
	use(ordo_client_maoka.jabs.set_attribute("placeholder", t_search))
	use(ordo_client_maoka.jabs.set_attribute("autocomplete", "off"))
	use(ordo_client_maoka.jabs.set_attribute("value", $.select("search_value")))
	use(ordo_client_maoka.jabs.listen("oninput", handle_input))
	use(maoka_dom.jabs.onmount(handle_mount))
})

const IGNORED_KEYS = ["Control", "Shift", "Alt", "Meta"]

const global_palette = (): OrdoClient.CommandPalette.Instance<() => void> => ({
	items: $.select("items"),
	on_select: item => item.value(),
})

const item_title = maoka_styled.div("command-palette_item_title-wrapper")
const item_info = maoka_styled.div("command-palette_item_info")
const item_main = maoka_styled.div("command-palette_item_main")
const item_footer = maoka_styled.div("command-palette_item_footer")
const item_icon = maoka_styled.span<{ render: OrdoClient.CommandPalette.RenderIcon }>(
	"command-palette_item_icon",
	({ render, use }) => use(maoka_dom.jabs.if_dom(n => void render(n.value))),
)
const text_span = maoka_styled.span()
const footer = maoka_styled.div("command-palette_footer")
const items = maoka_styled.div("command-palette_items")
const nothing_found_div = maoka_styled.div("command-palette_items_nothing-found")
