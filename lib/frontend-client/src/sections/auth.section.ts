import { type Observable } from "rxjs"

import { type AuthResponse } from "@ordo-pink/backend-server-id"
import { Switch } from "@ordo-pink/switch"
import { type TCreateFunctionContext } from "@ordo-pink/core"
import { type TLogger } from "@ordo-pink/logger"
import { type TOption } from "@ordo-pink/option"
import { type TUserQuery } from "@ordo-pink/data"
import { init_create_component } from "@ordo-pink/maoka"
import { init_ordo_hooks } from "@ordo-pink/maoka-ordo-hooks"

type P = {
	logger: TLogger
	commands: Client.Commands.Commands
	user_query: TUserQuery
	auth$: Observable<TOption<AuthResponse>>
	ctx: TCreateFunctionContext
}
export const init_auth_section = ({ logger, ctx }: P) => {
	logger.debug("🟡 Initialising status bar auth...")

	const account_element = document.querySelector("#status-bar_account") as HTMLDivElement
	const AuthSection = init_view(ctx)
	account_element.replaceChildren(AuthSection())

	logger.debug("🟢 Initialised status bar auth.")
}

// --- View ---

const init_view = (ctx: TCreateFunctionContext) => {
	const create = init_create_component({
		create_element: document.createElement.bind(document),
		create_text: document.createTextNode.bind(document),
		hooks: { ...init_ordo_hooks(ctx) }, // TODO: Allow importing hooks
	})

	const div = create("div")

	const SignIn = div(() => {
		return div(use => {
			const element = use.current_element()
			const commands = use.commands()

			element.onclick = () => commands.emit("cmd.auth.open_sign_in")
			element.setAttribute(
				"class",
				"flex gap-x-4 transition-all duration-300 hover:bg-neutral-400 hover:dark:bg-neutral-700 rounded-lg cursor-pointer items-center px-2",
			)

			return [SignInIcon, SignInText]
		})
	})

	const sign_in_icon = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z"></path>
<path fill-rule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"></path>
</svg>`

	const SignInIcon = div({ unsafe_inner_html: sign_in_icon })
	const SignInText = div(use => {
		const translate = use.translations()

		return translate("t.auth.pages.sign_in.label")
	})

	const UserName = (user: User.User) =>
		div(use => {
			const element = use.current_element()
			element.setAttribute(
				"class",
				"first-letter:bg-gradient-to-tr first-letter:from-pink-500 first-letter:to-purple-500 first-letter:bg-clip-text first-letter:text-transparent",
			)

			return get_readable_name(user)
		})

	const User = div(use => {
		const translate = use.translations()
		const user = use.user_query().get_current()
		const element = use.current_element()

		element.setAttribute("class", "flex gap-x-4 items-center px-2")

		return user.cata({ Ok: UserName, Err: () => translate("t.common.state.loading") })
	})

	return div(use => (use.is_authenticated() ? User : SignIn))
}

// TODO: Move to user
const get_readable_name = (user: User.User): string =>
	Switch.of(user)
		.case(has_full_name, () => `${user.first_name} ${user.last_name}`)
		.case(has_first_name, () => user.first_name)
		.case(has_last_name, () => user.last_name)
		.default(() => user.handle.slice(1))

const has_first_name = (user: User.User) => !!user.first_name
const has_last_name = (user: User.User) => !!user.last_name
const has_full_name = (user: User.User) => has_first_name(user) && has_last_name(user)
