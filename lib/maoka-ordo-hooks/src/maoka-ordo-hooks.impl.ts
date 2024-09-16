// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { type Observable } from "rxjs"
import { equals } from "ramda"

import { F, T, keys_of } from "@ordo-pink/tau"
import { Maoka, type TMaokaProps } from "@ordo-pink/maoka"
import { type TMetadata, type TMetadataDTO, TMetadataQuery } from "@ordo-pink/data"
import { O } from "@ordo-pink/option"
import { R } from "@ordo-pink/result"
import { Switch } from "@ordo-pink/switch"
import { type TCreateFunctionContext } from "@ordo-pink/core"

export const ordo_context = Maoka.hooks.create_context<TCreateFunctionContext>()

export const get_commands = ({ use }: TMaokaProps) => {
	const { get_commands } = use(ordo_context.consume)
	const commands = use(computed("commands", get_commands))

	return commands
}

export const get_hosts = ({ use }: TMaokaProps) => {
	const { get_hosts } = use(ordo_context.consume)
	const logger = use(get_logger)

	const get_hosts_unwrapped = () =>
		get_hosts()
			.pipe(R.ops.err_tap(logger.alert))
			.cata(R.catas.or_else(() => null as never))

	const hosts = use(computed("hosts", get_hosts_unwrapped))

	return hosts
}

export const get_is_dev = ({ use }: TMaokaProps) => {
	const ctx = use(ordo_context.consume)
	const is_dev = use(computed("is_dev", () => ctx.is_dev))

	return is_dev
}

export const get_logger = ({ use }: TMaokaProps) => {
	const { get_logger } = use(ordo_context.consume)
	const logger = use(computed("logger", get_logger))

	return logger
}

export const get_fetch = ({ use }: TMaokaProps) => {
	const { get_fetch } = use(ordo_context.consume)
	const fetch = use(computed("fetch", get_fetch))

	return fetch
}

export const get_user_query = ({ use }: TMaokaProps) => {
	const { get_user_query } = use(ordo_context.consume)
	const logger = use(get_logger)

	const get_user_query_unwrapped = () =>
		get_user_query()
			.pipe(R.ops.err_tap(logger.alert))
			.cata(R.catas.or_else(() => null as never))

	const user_query = use(computed("user_query", get_user_query_unwrapped))
	use(rx_subscription(user_query.$, "user_query_version", 0, (a, b) => a < b))

	return user_query
}

export const get_file_associations = ({ use }: TMaokaProps) => {
	const { get_file_associations } = use(ordo_context.consume)
	const logger = use(get_logger)

	const get_file_associations_unwrapped = () =>
		get_file_associations()
			.pipe(R.ops.err_tap(logger.alert))
			.cata(R.catas.or_else(() => null as never))

	const file_associations$ = use(computed("file_associations", get_file_associations_unwrapped))
	const file_associations = use(
		rx_subscription(
			file_associations$,
			"file_associations_version",
			[],
			(a, b) => a.length !== b.length,
		),
	)

	return file_associations
}

export const get_current_file_association = ({ use }: TMaokaProps) => {
	const { get_current_file_association } = use(ordo_context.consume)
	const logger = use(get_logger)

	const get_current_file_association$ = () =>
		get_current_file_association()
			.pipe(R.ops.err_tap(logger.alert))
			.cata(R.catas.or_else(() => null as never))

	const current_file_association$ = use(
		computed("file_association$", get_current_file_association$),
	)
	const current_file_association = use(
		rx_subscription(current_file_association$, "file_association", O.None(), (prev, next) => {
			if (prev.is_none && next.is_none) return false
			if ((prev.is_none && next.is_some) || (prev.is_some && next.is_none)) return true

			const prev_unwrapped = prev.unwrap()!
			const next_unwrapped = next.unwrap()!

			return prev_unwrapped.name !== next_unwrapped.name
		}),
	)

	return current_file_association
}

export const get_is_authenticated = ({ use }: TMaokaProps) => {
	const { get_is_authenticated } = use(ordo_context.consume)
	const logger = use(get_logger)

	return get_is_authenticated()
		.pipe(R.ops.err_tap(logger.alert))
		.cata({
			Ok: $ => !!use(rx_subscription($, "is_authenticated", false, (a, b) => a !== b)),
			Err: () => false,
		})
}

export const get_metadata_query = ({ use }: TMaokaProps): TMetadataQuery => {
	const { get_metadata_query } = use(ordo_context.consume)
	const logger = use(get_logger)

	const get_metadata_query_unwrapped = () =>
		get_metadata_query()
			.pipe(R.ops.err_tap(logger.alert))
			.cata(R.catas.or_else(() => null as never))

	const metadata_query = use(computed("metadata_query", get_metadata_query_unwrapped))
	use(rx_subscription(metadata_query.$, "metadata_query_version", 0, (prev, next) => prev < next))

	return metadata_query
}

export const get_metadata_by_fsid =
	(fsid?: TMetadataDTO["fsid"]) =>
	({ use }: TMaokaProps) => {
		const query = use(get_metadata_query)

		return R.FromNullable(fsid)
			.pipe(R.ops.chain(fsid => query.get_by_fsid(fsid)))
			.pipe(R.ops.chain(metadata => R.FromNullable(metadata.unwrap())))
			.cata({ Ok: x => x, Err: () => void 0 })
	}

export const get_metadata_children =
	(fsid?: TMetadataDTO["fsid"]) =>
	({ use }: TMaokaProps) => {
		const query = use(get_metadata_query)

		return query.get_children(fsid ?? null).cata({ Ok: x => x, Err: () => [] as TMetadata[] })
	}

export const get_metadata_ancestors =
	(fsid?: TMetadataDTO["fsid"]) =>
	({ use }: TMaokaProps) => {
		const query = use(get_metadata_query)

		return R.FromNullable(fsid)
			.pipe(R.ops.chain(fsid => query.get_ancestors(fsid)))
			.cata({ Ok: x => x, Err: () => [] as TMetadata[] })
	}

export const get_translations = ({ use }: TMaokaProps) => {
	const { get_translations, translate } = use(ordo_context.consume)
	const translations$ = use(computed("translations", get_translations))

	const translations_subscription = rx_subscription(
		translations$,
		"translations_version",
		O.None(),
		(prev, next) =>
			Switch.OfTrue()
				.case(prev.is_none && next.is_none, F)
				.case(prev.is_none && next.is_some, T)
				.case(prev.is_some && next.is_none, T)
				.default(() => equals(prev.unwrap(), next.unwrap())),
	)

	use(translations_subscription)

	return translate
}

export const get_current_route = ({ use }: TMaokaProps) => {
	const { get_current_route } = use(ordo_context.consume)
	const logger = use(get_logger)

	const get_current_route_unwrapped = () =>
		get_current_route()
			.pipe(R.ops.err_tap(logger.alert))
			.cata(R.catas.or_else(() => null as never))

	const current_route$ = use(computed("current_route$", get_current_route_unwrapped))

	const current_route_subscription = rx_subscription(
		current_route$,
		"current_route",
		O.None(),
		(prev, next) =>
			Switch.OfTrue()
				.case(prev.is_none && next.is_none, F)
				.case(prev.is_none && next.is_some, T)
				.case(prev.is_some && next.is_none, T)
				.default(() => {
					const prev_unwrapped = prev.unwrap()
					const next_unwrapped = next.unwrap()

					return (
						prev_unwrapped?.path !== next_unwrapped?.path ||
						!equals(prev_unwrapped?.params, next_unwrapped?.params)
					)
				}),
	)

	const current_route = use(current_route_subscription)

	return current_route.unwrap()
}

// TODO: Drop usage of silkrouter
export const get_route_params = <$TExpectedParams extends string>({
	use,
}: TMaokaProps): Record<$TExpectedParams, string | undefined> => {
	const route = use(get_current_route)

	return R.FromNullable(route)
		.pipe(R.ops.chain(route => R.FromNullable(route.params)))
		.cata({
			Err: () => ({}) as Record<$TExpectedParams, string | undefined>,
			Ok: params =>
				keys_of(params).reduce(
					(acc, key) => ({
						...acc,
						[key]: params[key] ? decodeURIComponent((params as any)[key]) : void 0,
					}),
					{} as Record<$TExpectedParams, string | undefined>,
				),
		})
}

const component_state = new Map<string, Map<string, any>>()

export const state =
	<$TValue>(key: string, initial_value?: $TValue) =>
	({ refresh, get_internal_id, on_mount }: TMaokaProps) => {
		const id = get_internal_id()

		on_mount(() => {
			if (!component_state.has(id)) component_state.set(id, new Map())
			const cs = component_state.get(id)!
			if (!cs.has(key)) cs.set(key, initial_value)

			return () => {
				component_state.delete(id)
			}
		})

		const value = component_state.get(id)?.get(key) ?? initial_value

		return [
			value,
			(new_value_creator: (old_value: $TValue) => $TValue) => {
				const increment = new_value_creator(value)
				if (equals(increment, value)) return

				component_state.get(id)?.set(key, increment)
				refresh()
			},
		]
	}

const root_state = {} as Record<string, Record<string, { deps?: any[]; value: any }>>

export const computed =
	<$TResult, $TDeps extends any[] = any[]>(key: string, callback: () => $TResult, deps?: $TDeps) =>
	({ root_id }: TMaokaProps): $TResult => {
		if (!root_state[root_id]) root_state[root_id] = {}
		if (root_state[root_id][key]) {
			if (!deps) return root_state[root_id][key].value

			const deps_are_equal =
				root_state[root_id][key].deps?.reduce(
					(acc, dep, index) => acc && dep === deps[index],
					true,
				) ?? true

			if (deps_are_equal) return root_state[root_id][key].value
		}

		const value = callback()

		root_state[root_id][key] = { deps, value }

		return value
	}

export const rx_subscription = <$TValue>(
	$: Observable<$TValue>,
	key: string, // TODO: Drop key
	initial_value?: $TValue,
	should_update: (prev: $TValue, next: $TValue) => boolean = () => true,
) => {
	return ({ on_mount, use }: TMaokaProps): $TValue => {
		const [value, set_value] = use(state(key, initial_value))

		on_mount(() => {
			const subscription = $.subscribe(new_value => {
				if (!should_update(value, new_value)) return () => subscription.unsubscribe()

				set_value(() => new_value)
			})

			return () => subscription.unsubscribe()
		})

		return value
	}
}
