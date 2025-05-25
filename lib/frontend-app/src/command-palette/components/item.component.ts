import { components, jabs } from "@ordo-pink/sdk-maoka"
import { maoka, maoka_dom, maoka_styled } from "@ordo-pink/maoka"
import { maoka_jabs } from "@ordo-pink/maoka-jabs"

export const command_palette_item = maoka.create<{ item: Ordo.CommandPalette.Item; active: boolean }>(
	"div",
	({ active, item, use }) => {
		const handle_click = () => item.value()
		const t_name = use(jabs.translate$(item.readable_name))
		const t_description = use(jabs.translate$(item.description))

		use(maoka_jabs.set_id(String(item.id)))
		use(maoka_jabs.set_class("command-palette_item"))
		use(maoka_jabs.set_attribute("title", item.description))
		use(maoka_jabs.listen("onclick", handle_click))

		if (active) use(maoka_jabs.add_class("active"))
		else use(maoka_jabs.remove_class("active"))

		return () => [
			item_main(() => [
				item_title(() => [item.render_icon && item_icon({ render: item.render_icon }), t_name()]),
				item.hotkey && item_info(() => components.hotkey({ hotkey: item.hotkey!, decoration_only: true })),
			]),
			item_footer(() => t_description()),
		]
	},
)

const item_title = maoka_styled.div("command-palette_item_title-wrapper")
const item_info = maoka_styled.div("command-palette_item_info")
const item_main = maoka_styled.div("command-palette_item_main")
const item_footer = maoka_styled.div("command-palette_item_footer")
const item_icon = maoka_styled.span<{ render: Ordo.CommandPalette.RenderIcon }>(
	"command-palette_item_icon",
	({ render, use }) => use(maoka_dom.jabs.if_dom(n => void render(n.value))),
)
