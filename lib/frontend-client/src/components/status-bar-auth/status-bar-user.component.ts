import { equals } from "ramda"

import { LoadingText } from "@ordo-pink/maoka-components"
import { Maoka } from "@ordo-pink/maoka"
import { OrdoHooks } from "@ordo-pink/maoka-ordo-hooks"
import { R } from "@ordo-pink/result"

import { UserName } from "./status-bar-username.component"

export const User = Maoka.create("div", ({ use, refresh }) => {
	let user: User.User | null = null

	use(Maoka.hooks.set_class(...user_classes))

	const user_query = use(OrdoHooks.user_query)

	const handle_user_query_update = () =>
		user_query
			.get_current()
			.pipe(R.ops.chain(new_user => R.If(!equals(user, new_user), { T: () => new_user })))
			.pipe(R.ops.tap(new_user => void (user = new_user)))
			.cata(R.catas.if_ok(refresh))

	use(OrdoHooks.subscription(user_query.$, handle_user_query_update))

	return () => (user ? UserName(user) : LoadingText)
})

// --- Internal ---

const user_classes = [
	"w-full transition-all duration-300 rounded-lg cursor-pointer px-2",
	"hover:bg-neutral-400 hover:dark:bg-neutral-700",
]
