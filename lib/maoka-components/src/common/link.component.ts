import { Maoka, TMaokaChildren } from "@ordo-pink/maoka"
import { MaokaHooks } from "@ordo-pink/maoka-hooks"
import { OrdoHooks } from "@ordo-pink/maoka-ordo-hooks"
import { is_string } from "@ordo-pink/tau"

type P = { href: string; children?: TMaokaChildren; custom_class?: string; show_visited?: boolean }
export const Link = ({ href, children, custom_class, show_visited }: P) =>
	Maoka.create("a", ({ use }) => {
		const { emit } = use(OrdoHooks.commands)

		use(MaokaHooks.listen("onclick", click_listener(emit, href)))
		use(MaokaHooks.set_attribute("href", href))
		use(MaokaHooks.set_class(default_class))

		if (custom_class) use(MaokaHooks.add_class(custom_class))
		if (!show_visited) use(MaokaHooks.add_class(ignore_history_highlighting_class))
		if (is_string(children)) use(MaokaHooks.set_attribute("title", children))

		return () => children
	})

// --- Internal ---

const click_listener =
	(emit: Ordo.Command.Commands["emit"], href: string) => (event: MouseEvent) => {
		event.preventDefault()
		event.stopPropagation()

		emit("cmd.application.router.navigate", href)
	}

const ignore_history_highlighting_class = "text-inherit visited:text-inherit"

const default_class =
	"underline cursor-pointer decoration-neutral-500/50 decoration-1 underline-offset-2"
