// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { type Observable } from "rxjs"
import { equals } from "ramda"

import { Maoka, type TMaokaProps } from "@ordo-pink/maoka"
import { type TMetadata, type TMetadataDTO } from "@ordo-pink/data"
import { is_undefined, keys_of } from "@ordo-pink/tau"
import { O } from "@ordo-pink/option"
import { R } from "@ordo-pink/result"
import { type TCreateFunctionContext } from "@ordo-pink/core"

export const ordo_context = Maoka.hooks.create_context<TCreateFunctionContext>()

export const get_commands = ({ use }: TMaokaProps) => {
	const ctx = use(ordo_context.consume)
	return ctx.get_commands()
}

export const get_hosts = ({ use }: TMaokaProps) => {
	const ctx = use(ordo_context.consume)
	return ctx
		.get_hosts()
		.pipe(R.ops.err_tap(use(get_logger).alert))
		.cata({ Ok: x => x, Err: null as never })
}

export const get_is_dev = ({ use }: TMaokaProps) => {
	const ctx = use(ordo_context.consume)
	return ctx.is_dev
}

export const get_logger = ({ use }: TMaokaProps) => {
	const ctx = use(ordo_context.consume)
	return ctx.get_logger()
}

export const get_fetch = ({ use }: TMaokaProps) => {
	const ctx = use(ordo_context.consume)
	return ctx.get_fetch()
}

export const get_user_query = ({ use }: TMaokaProps) => {
	const { get_user_query } = use(ordo_context.consume)
	const logger = use(get_logger)

	return get_user_query()
		.pipe(R.ops.tap(({ $ }) => use(rx_subscription($, "uq_version", 0, (a, b) => a < b))))
		.pipe(R.ops.err_tap(logger.alert))
		.cata(R.catas.or_else(() => null as never))
}

export const get_file_associations = ({ use }: TMaokaProps) => {
	const { get_file_associations } = use(ordo_context.consume)
	const logger = use(get_logger)

	return get_file_associations()
		.pipe(R.ops.map($ => use(rx_subscription($, "file_associations", []))))
		.pipe(R.ops.err_tap(logger.alert))
		.cata(R.catas.or_else(() => [] as Functions.FileAssociation[]))
}

export const get_current_file_association = ({ use }: TMaokaProps) => {
	const { get_current_file_association } = use(ordo_context.consume)
	const logger = use(get_logger)

	return get_current_file_association()
		.pipe(
			R.ops.map($ =>
				use(
					rx_subscription($, "file_associations", O.None(), (a, b) => {
						if (a.is_none && b.is_none) return false
						if ((a.is_none && b.is_some) || (a.is_some && b.is_none)) return true

						const ua = a.unwrap()!
						const ub = b.unwrap()!

						return ua.name !== ub.name
					}),
				),
			),
		)
		.pipe(R.ops.err_tap(logger.alert))
		.cata(R.catas.or_else(() => null as never))
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

export const get_metadata_query = ({ use }: TMaokaProps) => {
	const { get_metadata_query } = use(ordo_context.consume)
	const logger = use(get_logger)

	return get_metadata_query()
		.pipe(R.ops.tap(({ $ }) => use(rx_subscription($, "mq_version", -1, (a, b) => a < b))))
		.pipe(R.ops.err_tap(logger.alert))
		.cata(R.catas.or_else(() => null as never))
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

	use(rx_subscription(get_translations(), "t_version"))

	return translate
}

export const get_current_route = ({ use }: TMaokaProps) => {
	const { get_current_route } = use(ordo_context.consume)
	const logger = use(get_logger)

	return get_current_route()
		.pipe(R.ops.err_tap(logger.alert))
		.pipe(
			R.ops.map($ =>
				rx_subscription($, "current_route", O.None(), (a, b) => {
					if (a.is_none && b.is_none) return false
					if ((a.is_none && b.is_some) || (a.is_some && b.is_none)) return true

					const ua = a.unwrap()!
					const ub = b.unwrap()!

					return !equals(ua.params, ub.params) || !equals(ua.route, ub.route)
				}),
			),
		)
		.pipe(R.ops.map(use))
		.cata({ Ok: v => v.unwrap()!, Err: () => null as never })
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

const rx_state = {} as Record<string, any>

export const rx_subscription = <$TValue>(
	$: Observable<$TValue>,
	key: string, // TODO: Drop key
	initial_value?: $TValue,
	should_update: (prev: $TValue, next: $TValue) => boolean = () => true,
) => {
	if (is_undefined(rx_state[key])) rx_state[key] = initial_value

	return ({ on_mount, refresh }: TMaokaProps): $TValue => {
		on_mount(() => {
			const subscription = $.subscribe(value => {
				if (!should_update(rx_state[key], value)) return () => subscription.unsubscribe()

				rx_state[key] = value
				refresh()
			})

			return () => subscription.unsubscribe()
		})

		return rx_state[key]
	}
}
