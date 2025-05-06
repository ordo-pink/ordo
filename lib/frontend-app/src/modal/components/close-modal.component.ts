import { bs_x } from "@ordo-pink/frontend-icons"
import { maoka } from "@ordo-pink/maoka"
import { maoka_jabs } from "@ordo-pink/maoka-jabs"

import { app_context } from "../../../app-context"

export const close_modal = maoka.create("div", ({ use }) => {
	const { hunter } = use(app_context.consume)

	use(maoka_jabs.set_class("modal_close"))
	use(maoka_jabs.listen("onclick", internal.handle_click(hunter)))

	return () => bs_x({})
})

namespace internal {
	export const handle_click = (hunter: Ordo.Hunter) => () => void hunter.shoot("modal.hide")
}
