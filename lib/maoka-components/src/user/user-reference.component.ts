import { BsCaretRight } from "@ordo-pink/frontend-icons"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaHooks } from "@ordo-pink/maoka-hooks"
import { OrdoHooks } from "@ordo-pink/maoka-ordo-hooks"
import { Result } from "@ordo-pink/result"

// TODO: Lead to user page
// TODO: Get actual user (id: string) =>
export const CurrentUserReference = Maoka.create("div", ({ use, refresh, on_unmount }) => {
	let name = ""

	use(MaokaHooks.set_class("flex gap-x-2 items-center text-sm"))

	const user_query = use(OrdoHooks.user_query)

	const subscription = user_query.$.subscribe(() =>
		user_query
			.get_current()
			.pipe(Result.ops.map(user => void (name = user.get_readable_name())))
			.cata(Result.catas.if_ok(() => void refresh())),
	)

	on_unmount(() => subscription.unsubscribe())

	return () => [UserAvatar, UserName(name)]
})

const user_avatar_class = [
	"flex shrink-0 cursor-pointer items-center justify-center rounded-full p-0.5 shadow-lg",
	"bg-gradient-to-tr from-sky-400 via-purple-400 to-rose-400",
]

const UserAvatar = Maoka.create("div", ({ use }) => {
	use(MaokaHooks.set_class(...user_avatar_class))

	return () =>
		Maoka.create("div", ({ use }) => {
			use(MaokaHooks.set_class("rounded-full bg-neutral-500"))

			return () => UserAvatarIcon
		})
})

const UserAvatarIcon = Maoka.create("div", ({ use }) => {
	use(MaokaHooks.set_class("size-3 rounded-full text-xs"))

	// TODO: User icon
	return () => BsCaretRight("size-3 white")
})

export const UserName = (name: string) =>
	Maoka.create("div", ({ use }) => {
		use(MaokaHooks.set_class(highlight_first_letter_class))

		return () => name
	})

// --- Internal ---

const highlight_first_letter_class =
	"first-letter:bg-gradient-to-tr first-letter:from-pink-500 first-letter:to-purple-500 first-letter:bg-clip-text first-letter:text-transparent"
