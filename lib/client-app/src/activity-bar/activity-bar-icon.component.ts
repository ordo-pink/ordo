import { maoka } from "@ordo-pink/oss-maoka"
import { maoka_dom } from "@ordo-pink/oss-maoka/dom"

export const activity_bar_icon = maoka.create<
	Required<Pick<OrdoClient.Activity.Instance, "render_icon" | "readable_name">> & { is_current: boolean }
>("span", ({ use, is_current, render_icon, readable_name }) => {
	const translate = use(ordo_client_maoka.jabs.translate$)

	use(ordo_client_maoka.jabs.set_class("activity-bar_icon"))
	use(maoka_dom.jabs.if_dom(n => void render_icon(n.value)))

	return () => {
		use(ordo_client_maoka.jabs.set_attribute("title", translate(readable_name)))

		if (is_current) use(ordo_client_maoka.jabs.add_class("active"))
		else use(ordo_client_maoka.jabs.remove_class("active"))
	}
})
