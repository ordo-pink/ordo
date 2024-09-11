import { Maoka, TChildren } from "@ordo-pink/maoka"
import { OrdoHooks } from "@ordo-pink/maoka-ordo-hooks"

type P = { href: string; children?: TChildren; custom_class?: string }
export const Link = ({ href, children, custom_class }: P) =>
	Maoka.create("a", ({ use }) => {
		const { emit } = use(OrdoHooks.commands)

		use(click_listener(emit, href))
		use(Maoka.hooks.set_attribute("href", href))
		use(Maoka.hooks.set_class("underline cursor-pointer"))
		if (custom_class) use(Maoka.hooks.add_class(custom_class))

		return children
	})

const click_listener = (emit: Client.Commands.Commands["emit"], href: string) =>
	Maoka.hooks.listen("onclick", event => {
		event.preventDefault()
		event.stopPropagation()

		emit("cmd.application.router.navigate", href)
	})
