/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { type TMaokaJab } from "@ordo-pink/maoka"
import { type TZags } from "@ordo-pink/zags"
import { deep_equals } from "@ordo-pink/tau"

export const ordo_context = MaokaJabs.create_context<Ordo.CreateFunction.State>()

export const get_commands: TMaokaJab<Ordo.Command.Commands> = ({ use }) => {
	const zags = use(ordo_context.consume)
	return zags.commands
}

export const get_current_route$: TMaokaJab<() => Ordo.Router.Route | undefined> = ({ use }) => {
	const { router$ } = use(ordo_context.consume)
	const get_router = use(happy_marriage$(router$))

	return () => get_router().current_route
}

export const get_route_params$: TMaokaJab<() => Record<string, string>> = ({ use }) => {
	const get_current_route = use(get_current_route$)

	return () => get_current_route()?.params ?? {}
}

export const happy_marriage$ =
	<T extends Record<string, unknown>>(zags: TZags<T>): TMaokaJab<() => T> =>
	({ on_unmount, refresh }) => {
		let value: T

		const divorce = zags.marry(state => {
			if (deep_equals(value, state)) return

			value = state
			void refresh()
		})

		on_unmount(divorce)

		return () => value
	}

// export const get_logger: TMaokaJab<TLogger> = ({ use }) => {
// 	const { get_logger } = use(ordo_context.consume)
// 	return get_logger()
// }

// export const get_fetch: TMaokaJab<Ordo.Fetch> = ({ use }) => {
// 	const { get_fetch } = use(ordo_context.consume)
// 	return use(computed("fetch", get_fetch))
// }

export const get_user_query: TMaokaJab<Ordo.User.Query> = ({ use }) => {
	const zags = use(ordo_context.consume)
	return zags.user_query
}

export const get_metadata_query: TMaokaJab<Ordo.Metadata.Query> = ({ use }) => {
	const zags = use(ordo_context.consume)
	return zags.metadata_query
}

export const get_content_query: TMaokaJab<Ordo.Content.Query> = ({ use }) => {
	const zags = use(ordo_context.consume)
	return zags.content_query
}

// export const get_content_query: TMaokaJab<Ordo.Content.Query> = ({ use }) => {
// 	const { get_content_query } = use(ordo_context.consume)
// 	const logger = use(get_logger)

// 	const unwrap_content_query = () =>
// 		get_content_query()
// 			.pipe(R.ops.err_tap(logger.alert))
// 			.cata(R.catas.or_else(() => null as never))

// 	return use(computed("content_query", unwrap_content_query))
// }

export const get_translations$: TMaokaJab<{ t: Ordo.I18N.TranslateFn }> = ({ use, refresh }) => {
	const { translate } = use(ordo_context.consume)

	translate.$.marry((_, is_update) => {
		if (is_update) return
		void refresh()
	})

	return { t: translate }
}

// export const get_current_route$: TMaokaJab<Observable<TOption<Ordo.Router.Route>>> = ({ use }) => {
// 	const { get_current_route } = use(ordo_context.consume)
// 	const logger = use(get_logger)

// 	const unwrap_current_route$ = () =>
// 		get_current_route()
// 			.pipe(R.ops.err_tap(logger.alert))
// 			.cata(R.catas.or_else(() => null as never))

// 	return use(computed("current_route$", unwrap_current_route$))
// }

// TODO: Drop usage of silkrouter
// export const get_route_params: TMaokaJab<() => Record<string, string | undefined>> = ({ use }) => {
// 	type RouteParams = Record<string, string | undefined>

// 	const $ = use(get_current_route$)
// 	const initial_state = {} as RouteParams

// 	const url_decode_params = (params: RouteParams) =>
// 		keys_of(params).reduce(
// 			(acc, key) => ({ ...acc, [key]: params[key] ? decodeURIComponent(params[key]) : void 0 }),
// 			{} as RouteParams,
// 		)

// 	const handle_current_route_update = (value: TOption<Ordo.Router.Route>): RouteParams => {
// 		const new_route = value.unwrap() ?? null

// 		if (!new_route) {
// 			return {} as RouteParams
// 		}

// 		return url_decode_params(new_route.params ?? {})
// 	}

// 	return use(from$($, initial_state, handle_current_route_update))
// }

// --- Internal ---

const computed_state = {} as Record<string, Record<string, { deps?: any[]; value: any }>>

export const computed =
	<$TResult, $TDeps extends any[] = any[]>(key: string, callback: () => $TResult, deps?: $TDeps): TMaokaJab<$TResult> =>
	({ root_id }): $TResult => {
		if (!computed_state[root_id]) computed_state[root_id] = {}
		if (computed_state[root_id][key]) {
			if (!deps) return computed_state[root_id][key].value

			const deps_are_equal =
				computed_state[root_id][key].deps?.reduce((acc, dep, index) => acc && dep === deps[index], true) ?? true

			if (deps_are_equal) return computed_state[root_id][key].value
		}

		const value = callback()

		computed_state[root_id][key] = { deps, value }

		return value
	}
