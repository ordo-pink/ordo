import { get_is_authenticated, ordo_context } from "@ordo-pink/maoka-ordo-hooks"
import { type TCreateFunctionContext } from "@ordo-pink/core"
import { create } from "@ordo-pink/maoka"

import { SignIn } from "./status-bar-sign-in.component"
import { User } from "./status-bar-user.component"

export const StatusBarAuth = (ctx: TCreateFunctionContext) =>
	create("div", ({ use }) => {
		use(ordo_context.provide(ctx))
		const is_authenticated = use(get_is_authenticated)

		return is_authenticated ? User : SignIn
	})
