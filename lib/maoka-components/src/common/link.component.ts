import { Maoka, TMaokaChildren } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { is_string } from "@ordo-pink/tau"

type P = { href: string; children?: TMaokaChildren; custom_class?: string; show_visited?: boolean }
export const Link = ({ href, children, custom_class, show_visited }: P) =>
	Maoka.create("a", ({ use }) => {
		const { emit } = use(MaokaOrdo.Jabs.Commands)

		use(MaokaJabs.listen("onclick", click_listener(emit, href)))
		use(MaokaJabs.set_attribute("href", href))
		use(MaokaJabs.set_class(default_class))

		if (custom_class) use(MaokaJabs.add_class(custom_class))
		if (!show_visited) use(MaokaJabs.add_class(ignore_history_highlighting_class))
		if (is_string(children)) use(MaokaJabs.set_attribute("title", children))

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
