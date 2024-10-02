import { MaokaOrdo, ordo_context } from "@ordo-pink/maoka-ordo-hooks"
import { Maoka } from "@ordo-pink/maoka"

import { SignIn } from "./status-bar-sign-in.component"
import { User } from "./status-bar-user.component"

export const StatusBarAuth = (ctx: Ordo.CreateFunction.Params) =>
	Maoka.create("div", ({ use, refresh }) => {
		let is_authenticated = false

		use(ordo_context.provide(ctx))

		const $ = use(MaokaOrdo.Hooks.is_authenticated)

		use(
			MaokaOrdo.Hooks.subscription($, value => {
				if (is_authenticated === value) return
				is_authenticated = value
				refresh()
			}),
		)

		return () => (is_authenticated ? User : SignIn)
	})
