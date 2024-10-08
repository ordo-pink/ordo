import { BS_X } from "@ordo-pink/frontend-icons"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"

export const ModalCloseButton = (should_show = false) => {
	if (!should_show) return

	return Maoka.create("button", ({ use }) => {
		const commands = use(MaokaOrdo.Jabs.Commands)

		use(MaokaJabs.set_class("modal_close-button"))
		use(MaokaJabs.listen("onclick", event => handle_click(event)))

		const handle_click = (event: MouseEvent) => {
			event.preventDefault()
			commands.emit("cmd.application.modal.hide")
		}

		use(MaokaJabs.set_inner_html(BS_X))
	})
}
