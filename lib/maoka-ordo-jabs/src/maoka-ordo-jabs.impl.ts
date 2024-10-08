// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { type Observable } from "rxjs"

import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { R } from "@ordo-pink/result"
import { type TLogger } from "@ordo-pink/logger"
import { type TMaokaJab } from "@ordo-pink/maoka"
import { type TOption } from "@ordo-pink/option"
import { keys_of } from "@ordo-pink/tau"

export const ordo_context = MaokaJabs.create_context<Ordo.CreateFunction.Params>()

export const get_commands: TMaokaJab<Ordo.Command.Commands> = ({ use }) => {
	const { get_commands } = use(ordo_context.consume)
	return use(computed("commands", get_commands))
}

export const get_hosts: TMaokaJab<Ordo.Hosts> = ({ use }) => {
	const { get_hosts } = use(ordo_context.consume)
	const logger = use(get_logger)

	const get_hosts_unwrapped = () =>
		get_hosts()
			.pipe(R.ops.err_tap(logger.alert))
			.cata(R.catas.or_else(() => null as never))

	return use(computed("hosts", get_hosts_unwrapped))
}

export const get_is_dev: TMaokaJab<boolean> = ({ use }) => {
	const ctx = use(ordo_context.consume)
	return use(computed("is_dev", () => ctx.is_dev))
}

export const get_logger: TMaokaJab<TLogger> = ({ use }) => {
	const { get_logger } = use(ordo_context.consume)
	return get_logger()
}

export const get_fetch: TMaokaJab<Ordo.Fetch> = ({ use }) => {
	const { get_fetch } = use(ordo_context.consume)
	return use(computed("fetch", get_fetch))
}

export const get_user_query: TMaokaJab<Ordo.User.Query> = ({ use }) => {
	const { get_user_query } = use(ordo_context.consume)
	const logger = use(get_logger)

	const unwrap_user_query = () =>
		get_user_query()
			.pipe(R.ops.err_tap(logger.alert))
			.cata(R.catas.or_else(() => null as never))

	return use(computed("user_query", unwrap_user_query))
}

export const get_file_associations$: TMaokaJab<Observable<Ordo.FileAssociation.Instance[]>> = ({
	use,
}) => {
	const { get_file_associations } = use(ordo_context.consume)
	const logger = use(get_logger)

	const unwrap_file_associations$ = () =>
		get_file_associations()
			.pipe(R.ops.err_tap(logger.alert))
			.cata(R.catas.or_else(() => null as never))

	return use(computed("file_associations$", unwrap_file_associations$))
}

export const get_current_file_association$: TMaokaJab<
	Observable<TOption<Ordo.FileAssociation.Instance>>
> = ({ use }) => {
	const { get_current_file_association } = use(ordo_context.consume)
	const logger = use(get_logger)

	const unwrap_current_file_association$ = () =>
		get_current_file_association()
			.pipe(R.ops.err_tap(logger.alert))
			.cata(R.catas.or_else(() => null as never))

	return use(computed("current_file_association$", unwrap_current_file_association$))
}

export const get_is_authenticated$: TMaokaJab<Observable<boolean>> = ({ use }) => {
	const { get_is_authenticated } = use(ordo_context.consume)
	const logger = use(get_logger)

	const unwrap_is_authenticated = () =>
		get_is_authenticated()
			.pipe(R.ops.err_tap(logger.alert))
			.cata(R.catas.or_else(() => null as never))

	return use(computed("is_authenticated$", unwrap_is_authenticated))
}

export const get_is_authenticated: TMaokaJab<() => boolean> = ({ use }) => {
	const $ = use(get_is_authenticated$)

	return use(from$($, false, x => x))
}

export const get_metadata_query: TMaokaJab<Ordo.Metadata.Query> = ({ use }) => {
	const { get_metadata_query } = use(ordo_context.consume)
	const logger = use(get_logger)

	const unwrap_metadata_query = () =>
		get_metadata_query()
			.pipe(R.ops.err_tap(logger.alert))
			.cata(R.catas.or_else(() => null as never))

	return use(computed("metadata_query", unwrap_metadata_query))
}

export const get_translations: TMaokaJab<{ t: Ordo.I18N.TranslateFn }> = ({ use, refresh }) => {
	const { get_translations, translate } = use(ordo_context.consume)
	const $ = get_translations()

	use(subscription($, refresh))

	return { t: translate }
}

export const get_current_route$: TMaokaJab<Observable<TOption<Ordo.Router.Route>>> = ({ use }) => {
	const { get_current_route } = use(ordo_context.consume)
	const logger = use(get_logger)

	const unwrap_current_route$ = () =>
		get_current_route()
			.pipe(R.ops.err_tap(logger.alert))
			.cata(R.catas.or_else(() => null as never))

	return use(computed("current_route$", unwrap_current_route$))
}

// TODO: Drop usage of silkrouter
export const get_route_params: TMaokaJab<() => Record<string, string | undefined>> = ({ use }) => {
	type RouteParams = Record<string, string | undefined>

	const $ = use(get_current_route$)
	const initial_state = {} as RouteParams

	const url_decode_params = (params: RouteParams) =>
		keys_of(params).reduce(
			(acc, key) => ({ ...acc, [key]: params[key] ? decodeURIComponent(params[key]) : void 0 }),
			{} as RouteParams,
		)

	const handle_current_route_update = (value: TOption<Ordo.Router.Route>): RouteParams => {
		const new_route = value.unwrap() ?? null

		if (!new_route) {
			return {} as RouteParams
		}

		return url_decode_params(new_route.params ?? {})
	}

	return use(from$($, initial_state, handle_current_route_update))
}

// --- Internal ---

const computed_state = {} as Record<string, Record<string, { deps?: any[]; value: any }>>

export const computed =
	<$TResult, $TDeps extends any[] = any[]>(
		key: string,
		callback: () => $TResult,
		deps?: $TDeps,
	): TMaokaJab<$TResult> =>
	({ root_id }): $TResult => {
		if (!computed_state[root_id]) computed_state[root_id] = {}
		if (computed_state[root_id][key]) {
			if (!deps) return computed_state[root_id][key].value

			const deps_are_equal =
				computed_state[root_id][key].deps?.reduce(
					(acc, dep, index) => acc && dep === deps[index],
					true,
				) ?? true

			if (deps_are_equal) return computed_state[root_id][key].value
		}

		const value = callback()

		computed_state[root_id][key] = { deps, value }

		return value
	}

export const subscription =
	<$TValue, $TTransformedValue = $TValue>(
		$: Observable<$TValue>,
		f: (value: $TValue) => $TTransformedValue,
	): TMaokaJab =>
	({ on_unmount }) => {
		const subscription = $.subscribe(f)
		on_unmount(() => subscription.unsubscribe())
	}

export const from$ =
	<$TValue, $TTransformedValue = $TValue>(
		$: Observable<$TValue>,
		initial_value: $TTransformedValue,
		transformer_fn: (new_value: $TValue) => $TTransformedValue = x =>
			x as unknown as $TTransformedValue,
	): TMaokaJab<() => $TTransformedValue> =>
	({ use, refresh }) => {
		let value = initial_value

		const handle_stream_update = (new_value: $TValue) => {
			const transformed_new_value = transformer_fn(new_value)
			if (value !== transformed_new_value) {
				value = transformed_new_value
				void refresh()
			}
		}

		use(subscription($, handle_stream_update))

		return () => value
	}
