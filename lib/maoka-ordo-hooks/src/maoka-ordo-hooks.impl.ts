// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { type TCreateFunctionContext, type TFetch, type THosts } from "@ordo-pink/core"
import { type TInitHook } from "@ordo-pink/maoka"
import { type TLogger } from "@ordo-pink/logger"
import { type TUserQuery } from "@ordo-pink/data"
import { noop } from "@ordo-pink/tau"

const state = {
	is_authenticated: false,
}

export const init_ordo_hooks = (
	ctx: TCreateFunctionContext,
): TInitHook<{
	translations: () => typeof ctx.translate
	user_query: () => TUserQuery
	commands: () => Client.Commands.Commands
	is_authenticated: () => boolean
	is_dev: () => boolean
	logger: () => TLogger
	fetch: () => TFetch
	hosts: () => THosts
}> => ({
	logger: () => ctx.get_logger,
	commands: () => ctx.get_commands,
	is_dev: () => () => ctx.is_dev,
	fetch: () => ctx.get_fetch,
	hosts: () => () => ctx.get_hosts().cata({ Ok: x => x, Err: noop as never }),

	translations: use => () => {
		use.on_mount(() => ctx.get_translations().subscribe(() => use.refresh()))

		return ctx.translate
	},

	user_query: use => () => {
		const user_query = ctx.get_user_query().cata({ Ok: x => x, Err: () => noop as never })

		if (user_query) use.on_mount(() => user_query.$.subscribe(() => use.refresh()))

		return user_query
	},

	is_authenticated: use => () => {
		const is_authenticated$ = ctx
			.get_is_authenticated()
			.cata({ Ok: x => x, Err: () => noop as never })

		if (is_authenticated$)
			use.on_mount(() => {
				is_authenticated$.subscribe(is_authenticated => {
					state.is_authenticated = is_authenticated
					use.refresh()
				})
			})

		return is_authenticated$ && state.is_authenticated
	},
})
