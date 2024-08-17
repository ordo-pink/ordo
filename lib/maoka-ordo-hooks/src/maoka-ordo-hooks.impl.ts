// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import {
	type TCreateFunctionContext,
	type TFetch,
	type THosts,
	TTranslateFn,
} from "@ordo-pink/core"
import { type TInitHook } from "@ordo-pink/maoka"
import { type TLogger } from "@ordo-pink/logger"
import { type TUserQuery } from "@ordo-pink/data"
import { noop } from "@ordo-pink/tau"

const state = {
	is_authenticated: false,
}

export type TOrdoHooks = {
	get_commands: () => Client.Commands.Commands
	get_fetch: () => TFetch
	get_hosts: () => THosts
	get_is_authenticated: () => boolean
	get_is_dev: () => boolean
	get_logger: () => TLogger
	get_translations: () => TTranslateFn
	get_user_query: () => TUserQuery
}

export const init_ordo_hooks = (
	ctx: TCreateFunctionContext,
): TInitHook<{
	get_commands: () => Client.Commands.Commands
	get_fetch: () => TFetch
	get_hosts: () => THosts
	get_is_authenticated: () => boolean
	get_is_dev: () => boolean
	get_logger: () => TLogger
	get_translations: () => typeof ctx.translate
	get_user_query: () => TUserQuery
}> => ({
	get_logger: () => ctx.get_logger,
	get_commands: () => ctx.get_commands,
	get_is_dev: () => () => ctx.is_dev,
	get_fetch: () => ctx.get_fetch,
	get_hosts: () => () => ctx.get_hosts().cata({ Ok: x => x, Err: noop as never }),

	get_translations: use => () => {
		use.on_mount(() => ctx.get_translations().subscribe(() => use.refresh()))

		return ctx.translate
	},

	get_user_query: use => () => {
		const user_query = ctx.get_user_query().cata({ Ok: x => x, Err: () => noop as never })

		if (user_query) use.on_mount(() => user_query.$.subscribe(() => use.refresh()))

		return user_query
	},

	get_is_authenticated: use => () => {
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
