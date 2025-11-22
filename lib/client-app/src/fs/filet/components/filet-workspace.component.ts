import { bs_plus } from "@ordo-pink/frontend-icons"
import { maoka } from "@ordo-pink/oss-maoka"
import { maoka_styled } from "@ordo-pink/oss-maoka-styled"

import "./filet-workspace.styles.css"

type Args = { state: OrdoClient.F.State }
export const filet_workspace = maoka.create<Args>("div", ({ state, use }) => {
	use(ordo_client_maoka.context.provide(state))
	use(ordo_client_maoka.jabs.set_id("filet-workspace"))

	return () => [create_button(() => bs_plus())]
})

// --- Internal ---

const create_button = maoka_styled.button("create-button", ({ use }) => {
	const { hunter } = use(ordo_client_maoka.context.consume)

	// TODO Get parent from route params
	const handle_click = () => hunter.shoot("data.show_create_modal", { parent: null })

	use(ordo_client_maoka.jabs.listen("onclick", handle_click))
})
