import { create, listen, set_class } from "@ordo-pink/maoka"
import { get_commands, get_user_query } from "@ordo-pink/maoka-ordo-hooks"
import { Switch } from "@ordo-pink/switch"

import { LoadingText } from "../common/loading-text"

export const User = create("div", ({ use }) => {
	use(set_class("flex gap-x-4 items-center px-2"))

	const user_query = use(get_user_query)

	return user_query.get_current().cata({ Ok: UserName, Err: () => LoadingText })
})

const UserName = (user: User.User) =>
	create("div", ({ use }) => {
		const commands = use(get_commands)

		const click_listener = listen("onclick", event => {
			commands.emit("cmd.application.context_menu.show", {
				event: event as any,
				payload: "status-bar-user",
			})
		})

		use(set_class(highlight_first_letter_class))
		use(click_listener)

		return Switch.OfTrue()
			.case(!!user.first_name && !!user.last_name, () => get_full_name(user))
			.case(!!user.last_name, () => user.first_name)
			.case(!!user.last_name, () => user.last_name)
			.default(() => user.handle.slice(1))
	})

const highlight_first_letter_class =
	"cursor-pointer first-letter:bg-gradient-to-tr first-letter:from-pink-500 first-letter:to-purple-500 first-letter:bg-clip-text first-letter:text-transparent"

const get_full_name = (user: User.User) => `${user.first_name} ${user.last_name}`
