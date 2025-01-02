/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { Maoka, type TMaokaChildren } from "@ordo-pink/maoka"
import { Result } from "@ordo-pink/result"
import { type TZags } from "@ordo-pink/zags"
import { keys_of } from "@ordo-pink/tau"

import {
	get_commands,
	get_content_query,
	get_metadata_query,
	get_translations$,
	get_user_query,
	ordo_context,
} from "./src/maoka-ordo-jabs.impl"

export const MaokaOrdo = {
	Jabs: {
		get_commands,
		get_translations$,
		get_metadata_query,
		get_user_query,
		get_content_query,
	},
	Ops: {
		get_route_params: (route: Ordo.Router.Route | null) =>
			Result.FromNullable(route)
				.pipe(Result.ops.chain(route => Result.FromNullable(route.params)))
				.pipe(
					Result.ops.map(params =>
						keys_of(params).reduce(
							(acc, key) => ({
								...acc,
								[key]: params[key] ? decodeURIComponent((params as any)[key]) : void 0,
							}),
							{} as Record<string, string | undefined>,
						),
					),
				),
	},
	Context: ordo_context,
	Components: {
		WithCtx: (ctx: TZags<Ordo.CreateFunction.State>, children: () => TMaokaChildren) =>
			Maoka.create("div", ({ use }) => {
				use(MaokaOrdo.Context.provide(ctx))
				return children
			}),
		WithCtxCurry: (ctx: TZags<Ordo.CreateFunction.State>) => (children: () => TMaokaChildren) =>
			MaokaOrdo.Components.WithCtx(ctx, children),
	},
}
