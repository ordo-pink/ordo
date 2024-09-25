// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { type Observable } from "rxjs"
import { equals } from "ramda"

import { F, T, keys_of } from "@ordo-pink/tau"
import { type FSID, Metadata, type TMetadata, type TMetadataQuery } from "@ordo-pink/data"
import { Maoka, type TMaokaProps } from "@ordo-pink/maoka"
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
	return get_logger()
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
		.cata(R.catas.or_else(() => null as never))
}

export const get_metadata_query = ({ use }: TMaokaProps): TMetadataQuery => {
	const { get_metadata_query } = use(ordo_context.consume)
	const logger = use(get_logger)

	return use(
		computed("metadata_query", () =>
			get_metadata_query()
				.pipe(R.ops.err_tap(logger.alert))
				.cata(R.catas.or_else(() => null as never)),
		),
	)
}

export const get_metadata_by_fsid =
	(fsid?: string) =>
	({ use, refresh }: TMaokaProps) => {
		const query = use(get_metadata_query)
		const [metadata, set_metadata] = use(state<TMetadata | null>("metadata_by_fsid", null))

		const subscription = query.$.subscribe(() => {
			const new_metadata = R.FromNullable(fsid)
				.pipe(R.ops.chain(str => R.If(is_fsid(str), { T: () => str as FSID })))
				.pipe(R.ops.chain(fsid => query.get_by_fsid(fsid)))
				.pipe(R.ops.chain(metadata => R.FromNullable(metadata.unwrap())))
				.cata(R.catas.or_else(() => null))

			if (metadata && new_metadata && metadata.equals(new_metadata))
				return () => subscription.unsubscribe()

			set_metadata(() => new_metadata)
			refresh()
		})

		return metadata
	}

export const get_metadata_children =
	(fsid?: string) =>
	({ use }: TMaokaProps) => {
		const query = use(get_metadata_query)
		const [children, set_children] = use(state<TMetadata[]>("metadata_children", []))

		const subscription = query.$.subscribe(() => {
			const new_children = R.FromNullable(fsid)
				.pipe(R.ops.chain(str => R.If(is_fsid(str), { T: () => str as FSID })))
				.pipe(R.ops.chain(fsid => query.get_children(fsid)))
				.cata(R.catas.or_else(() => [] as TMetadata[]))

			if (
				!!children &&
				!!new_children &&
				children.length === new_children.length &&
				children.reduce((acc, child, index) => acc && child.equals(new_children[index]), true)
			)
				return () => subscription.unsubscribe()

			set_children(() => new_children)
		})

		return children
	}

export const get_metadata_ancestors =
	(fsid?: string) =>
	({ use }: TMaokaProps) => {
		const query = use(get_metadata_query)
		const [ancestors, set_ancestors] = use(state<TMetadata[]>("metadata_ancestors", []))

		const subscription = query.$.subscribe(() => {
			const new_children = R.FromNullable(fsid)
				.pipe(R.ops.chain(str => R.If(is_fsid(str), { T: () => str as FSID })))
				.pipe(R.ops.chain(fsid => query.get_ancestors(fsid)))
				.cata(R.catas.or_else(() => [] as TMetadata[]))

			if (
				!!ancestors &&
				!!new_children &&
				ancestors.length === new_children.length &&
				ancestors.reduce((acc, child, index) => acc && child.equals(new_children[index]), true)
			)
				return () => subscription.unsubscribe()

			set_ancestors(() => new_children)
		})

		return ancestors
	}

export const get_translations = ({ use, refresh }: TMaokaProps) => {
	const { get_translations, translate } = use(ordo_context.consume)
	const $ = get_translations()

	use(subscription($, refresh))

	return { t: translate }
}

export const get_current_route = ({ use }: TMaokaProps) => {
	const { get_current_route } = use(ordo_context.consume)
	const logger = use(get_logger)

	const state: Record<"route", Client.Router.Route | null> = { route: null }

	const $ = get_current_route()
		.pipe(R.ops.err_tap(logger.alert))
		.cata(R.catas.or_else(() => null as never))

	return use(
		subscription($, new_route => {
			const new_route_unwrapped = new_route.unwrap()

			const should_update = Switch.OfTrue()
				.case(!!state.route && new_route.is_none, F)
				.case(!!state.route && new_route.is_some, T)
				.case(!!state.route && new_route.is_none, T)
				.default(
					() =>
						state.route?.path !== new_route_unwrapped?.path ||
						!equals(state.route?.params, new_route_unwrapped?.params),
				)

			if (should_update) {
				state.route = new_route_unwrapped ?? null
			}

			return state.route
		}),
	)
}

// TODO: Drop usage of silkrouter
export const get_route_params = ({ use, refresh }: TMaokaProps) => {
	const { get_current_route } = use(ordo_context.consume)
	const logger = use(get_logger)

	const state: Record<"value", Record<string, string | undefined>> = { value: {} }

	const $ = get_current_route()
		.pipe(R.ops.err_tap(logger.alert))
		.cata(R.catas.or_else(() => null as never))

	use(
		subscription($, new_route => {
			const new_route_unwrapped = new_route.unwrap()

			if (!equals(state.value, new_route_unwrapped?.params ?? {})) {
				const params = new_route_unwrapped?.params ?? {}
				state.value = keys_of(params).reduce(
					(acc, key) => ({
						...acc,
						[key]: params[key] ? decodeURIComponent((params as any)[key]) : void 0,
					}),
					{} as Record<string, string | undefined>,
				)
				refresh()
			}
		}),
	)

	return state
}

const component_state = new Map<string, Map<string, any>>()

export const state =
	<$TValue>(key: string, initial_value?: $TValue) =>
	({
		internal_id,
		on_unmount,
		refresh,
	}: TMaokaProps): [$TValue, (callback: (previous_value: $TValue) => $TValue) => void] => {
		if (!component_state.has(internal_id)) component_state.set(internal_id, new Map())
		const cs = component_state.get(internal_id)!
		if (!cs.has(key)) cs.set(key, initial_value)

		on_unmount(() => component_state.delete(internal_id))

		const value = component_state.get(internal_id)?.get(key) ?? initial_value

		return [
			value,
			(new_value_creator: (old_value: $TValue) => $TValue) => {
				const increment = new_value_creator(value)
				if (equals(increment, value)) return

				component_state.get(internal_id)?.set(key, increment)
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

export const subscription =
	<$TValue, $TTransformedValue>(
		$: Observable<$TValue>,
		f: (value: $TValue) => $TTransformedValue,
		initial_value = void 0,
	) =>
	({ on_unmount, refresh }: TMaokaProps) => {
		const state: Record<"value", $TTransformedValue | undefined> = { value: initial_value }

		const subscription = $.subscribe(x => {
			const new_value = f(x)

			if (!equals(state.value, new_value)) {
				state.value = new_value
				refresh()
			}
		})

		on_unmount(() => subscription.unsubscribe())

		return state
	}

export const rx_subscription = <$TValue>(
	$: Observable<$TValue>,
	key: string, // TODO: Drop key
	initial_value?: $TValue,
	should_update: (prev: $TValue, next: $TValue) => boolean = () => true,
) => {
	return ({ on_unmount, use }: TMaokaProps): $TValue => {
		const [value, set_value] = use(state(key, initial_value))

		const subscription = $.subscribe(new_value => {
			if (!should_update(value, new_value)) return () => subscription.unsubscribe()
			set_value(() => new_value)
		})

		on_unmount(() => subscription.unsubscribe())

		return value
	}
}

// --- Internal ---

const is_fsid = Metadata.Validations.is_fsid
