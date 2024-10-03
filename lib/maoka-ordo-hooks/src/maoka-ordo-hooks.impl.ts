// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { type Observable } from "rxjs"

import { MaokaHooks } from "@ordo-pink/maoka-hooks"
import { R } from "@ordo-pink/result"
import { type TMaokaProps } from "@ordo-pink/maoka"

export const ordo_context = MaokaHooks.create_context<Ordo.CreateFunction.Params>()

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

	return get_user_query()
		.pipe(R.ops.err_tap(logger.alert))
		.cata(R.catas.or_else(() => null as never))
}

export const get_file_associations = ({ use }: TMaokaProps) => {
	const { get_file_associations } = use(ordo_context.consume)
	const logger = use(get_logger)

	return get_file_associations()
		.pipe(R.ops.err_tap(logger.alert))
		.cata(R.catas.or_else(() => null as never))
}

export const get_current_file_association = ({ use }: TMaokaProps) => {
	const { get_current_file_association } = use(ordo_context.consume)
	const logger = use(get_logger)

	return get_current_file_association()
		.pipe(R.ops.err_tap(logger.alert))
		.cata(R.catas.or_else(() => null as never))
}

export const get_is_authenticated = ({ use }: TMaokaProps) => {
	const { get_is_authenticated } = use(ordo_context.consume)
	const logger = use(get_logger)

	return get_is_authenticated()
		.pipe(R.ops.err_tap(logger.alert))
		.cata(R.catas.or_else(() => null as never))
}

export const get_metadata_query = ({ use }: TMaokaProps): Ordo.Metadata.Query => {
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

export const get_translations = ({ use, refresh }: TMaokaProps) => {
	const { get_translations, translate } = use(ordo_context.consume)
	const $ = get_translations()

	use(subscription($, refresh))

	return { t: translate }
}

export const get_current_route = ({ use }: TMaokaProps) => {
	const { get_current_route } = use(ordo_context.consume)
	const logger = use(get_logger)

	return get_current_route()
		.pipe(R.ops.err_tap(logger.alert))
		.cata(R.catas.or_else(() => null as never))
}

// TODO: Drop usage of silkrouter
export const get_route_params = ({ use }: TMaokaProps) => {
	const { get_current_route } = use(ordo_context.consume)
	const logger = use(get_logger)

	return get_current_route()
		.pipe(R.ops.err_tap(logger.alert))
		.cata(R.catas.or_else(() => null as never))
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
	<$TValue, $TTransformedValue = $TValue>(
		$: Observable<$TValue>,
		f: (value: $TValue) => $TTransformedValue,
	) =>
	({ on_unmount }: TMaokaProps) => {
		const subscription = $.subscribe(f)
		on_unmount(() => subscription.unsubscribe())
	}
