import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"

import { ordo_app_state } from "../app.state"

export const OrdoWorkspace = Maoka.create("main", ({ use }) => {
	use(MaokaJabs.set_class("flex-grow"))

	return () => [
		Maoka.create("button", ({ use }) => {
			const commands = ordo_app_state.zags.select("commands")

			use(
				MaokaJabs.listen("onclick", () =>
					commands.emit("cmd.application.modal.show", {
						render: div =>
							Maoka.render_dom(
								div,
								Maoka.styled("div")(() => "TEST"),
							),
						on_unmount: () => console.log("UNMOUNTED"),
					}),
				),
			)

			return () => "MODAL"
		}),
		Maoka.create("button", ({ use }) => {
			const commands = ordo_app_state.zags.select("commands")
			commands.emit("cmd.application.sidebar.enable")

			use(
				MaokaJabs.listen("onclick", () => {
					commands.emit("cmd.application.sidebar.toggle")
				}),
			)

			return () => "SIDEBAR"
		}),
	]
})
