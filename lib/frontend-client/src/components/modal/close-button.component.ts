import { BS_X } from "@ordo-pink/frontend-icons"
import { Maoka } from "@ordo-pink/maoka"
import { Ordo } from "@ordo-pink/maoka-ordo-hooks"

export const ModalCloseButton = (should_show = false) => {
	if (!should_show) return

	return Maoka.create("button", ({ use }) => {
		const commands = use(Ordo.Hooks.commands)

		use(
			Maoka.hooks.set_class(
				"absolute right-0 top-0 cursor-pointer p-2",
				"text-neutral-500 hover:text-pink-500 transition-colors duration-300",
			),
		)

		use(
			Maoka.hooks.listen("onclick", event => {
				event.preventDefault()
				commands.emit("cmd.application.modal.hide")
			}),
		)

		use(Maoka.hooks.set_inner_html(BS_X))
	})
}
