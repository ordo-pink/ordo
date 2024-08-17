import { BS_BOX_ARROW_IN_RIGHT } from "@ordo-pink/frontend-icons"
import { type TOrdoHooks } from "@ordo-pink/maoka-ordo-hooks"
import { create } from "@ordo-pink/maoka"

const div = create<TOrdoHooks>("div")

export const SignIn = div(use => {
	const commands = use.get_commands()

	use.set_listener("onclick", () => commands.emit("cmd.auth.open_sign_in"))
	use.set_class(
		"flex gap-x-4 transition-all duration-300 rounded-lg cursor-pointer items-center px-2",
		"hover:bg-neutral-400 hover:dark:bg-neutral-700",
	)

	return [SignInIcon, SignInText]
})

const SignInIcon = div({ unsafe_inner_html: BS_BOX_ARROW_IN_RIGHT })

const SignInText = div(use => {
	const translate = use.get_translations()

	return translate("t.auth.pages.sign_in.label")
})
