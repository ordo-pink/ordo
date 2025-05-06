import { bs_x } from "@ordo-pink/frontend-icons"
import { maoka } from "@ordo-pink/maoka"
import { maoka_jabs } from "@ordo-pink/maoka-jabs"

import { app_context } from "../../../app-context"
import { modal$ } from "../modal.state"

export const close_modal = maoka.create("div", ({ use }) => {
	const { hunter } = use(app_context.consume)

	const handle_global_esc = (event: KeyboardEvent) => {
		if (event.code !== "Escape" || !modal$.select("instance")) return
		event.stopImmediatePropagation()
		hunter.shoot("modal.hide")
	}

	use(maoka_jabs.set_class("modal_close"))
	use(maoka_jabs.set_attribute("title", "Click here, or anywhere else outside the modal window, or press Escape to close."))
	use(maoka_jabs.listen("onclick", internal.handle_click(hunter)))
	use(maoka_jabs.listen_global_event("keydown", handle_global_esc))

	return () => bs_x({})
})

namespace internal {
	export const handle_click = (hunter: Ordo.Hunter) => () => void hunter.shoot("modal.hide")
}
