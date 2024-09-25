import { OrdoHooks, ordo_context } from "@ordo-pink/maoka-ordo-hooks"
import { Maoka } from "@ordo-pink/maoka"
import { type TCreateFunctionContext } from "@ordo-pink/core"

import { SignIn } from "./status-bar-sign-in.component"
import { User } from "./status-bar-user.component"

export const StatusBarAuth = (ctx: TCreateFunctionContext) =>
	Maoka.create("div", ({ use, refresh, on_unmount }) => {
		let is_authenticated = false

		use(ordo_context.provide(ctx))
		const is_autheticated$ = use(OrdoHooks.is_authenticated)

		const sub = is_autheticated$.subscribe(value => {
			if (is_authenticated === value) return

			is_authenticated = value
			refresh()
		})

		on_unmount(() => sub.unsubscribe())

		return () => (is_authenticated ? User : SignIn)
	})
