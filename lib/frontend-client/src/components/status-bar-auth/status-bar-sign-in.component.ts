import { create, listen, set_class, set_inner_html } from "@ordo-pink/maoka"
import { get_commands, get_translations } from "@ordo-pink/maoka-ordo-hooks"
import { BS_BOX_ARROW_IN_RIGHT } from "@ordo-pink/frontend-icons"

export const SignIn = create("div", ({ use }) => {
	const commands = use(get_commands)

	use(listen("onclick", () => commands.emit("cmd.auth.open_sign_in")))
	use(
		set_class(
			"flex gap-x-4 transition-all duration-300 rounded-lg cursor-pointer items-center px-2",
			"hover:bg-neutral-400 hover:dark:bg-neutral-700",
		),
	)

	return [SignInIcon, SignInText]
})

const SignInIcon = create("div", ({ use }) => {
	use(set_inner_html(BS_BOX_ARROW_IN_RIGHT))
})

const SignInText = create("div", ({ use }) => {
	const translate = use(get_translations)

	return translate("t.auth.pages.sign_in.label")
})
