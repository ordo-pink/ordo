import { Switch } from "@ordo-pink/switch"
import { TOrdoHooks } from "@ordo-pink/maoka-ordo-hooks"
import { create } from "@ordo-pink/maoka"

import { LoadingText } from "../common/loading-text"

const div = create<TOrdoHooks>("div")

export const User = div(use => {
	use.set_class("flex gap-x-4 items-center px-2")

	const user_query = use.get_user_query()

	return user_query.get_current().cata({ Ok: UserName, Err: () => LoadingText })
})

const UserName = (user: User.User) =>
	div(use => {
		use.set_class(highlight_first_letter_class)

		return Switch.OfTrue()
			.case(!!user.first_name && !!user.last_name, () => get_full_name(user))
			.case(!!user.last_name, () => user.first_name)
			.case(!!user.last_name, () => user.last_name)
			.default(() => user.handle.slice(1))
	})

const highlight_first_letter_class =
	"first-letter:bg-gradient-to-tr first-letter:from-pink-500 first-letter:to-purple-500 first-letter:bg-clip-text first-letter:text-transparent"

const get_full_name = (user: User.User) => `${user.first_name} ${user.last_name}`
