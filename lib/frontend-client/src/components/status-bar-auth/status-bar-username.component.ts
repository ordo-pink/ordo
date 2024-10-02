import { Maoka } from "@ordo-pink/maoka"
import { OrdoHooks } from "@ordo-pink/maoka-ordo-hooks"
import { Switch } from "@ordo-pink/switch"

export const UserName = (user: Ordo.User.Current.Instance) =>
	Maoka.create("div", ({ use }) => {
		const { emit } = use(OrdoHooks.commands)

		use(Maoka.hooks.set_class(highlight_first_letter_class))
		use(Maoka.hooks.listen("onclick", handle_click(emit)))

		return () =>
			Switch.OfTrue()
				.case(!!user.first_name && !!user.last_name, () => get_full_name(user))
				.case(!!user.last_name, () => user.first_name)
				.case(!!user.last_name, () => user.last_name)
				.default(() => user.handle.slice(1))
	})

// --- Internal ---

const handle_click = (emit: Ordo.Command.Commands["emit"]) => (event: MouseEvent) =>
	emit("cmd.application.context_menu.show", { event: event as any, payload: "status-bar-user" })

const highlight_first_letter_class =
	"first-letter:bg-gradient-to-tr first-letter:from-pink-500 first-letter:to-purple-500 first-letter:bg-clip-text first-letter:text-transparent"

// TODO: Move to user model
const get_full_name = (user: Ordo.User.Current.Instance) => `${user.first_name} ${user.last_name}`
