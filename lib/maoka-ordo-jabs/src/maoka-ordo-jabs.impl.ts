/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { type TMaokaElement, type TMaokaJab } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { R } from "@ordo-pink/result"
import { type TZags } from "@ordo-pink/zags"
import { deep_equals } from "@ordo-pink/tau"

export const ordo_context = MaokaJabs.create_context<Ordo.CreateFunction.State>()

export const get_commands: TMaokaJab<Ordo.Command.Commands> = ({ use }) => {
	const zags = use(ordo_context.consume)
	return zags.commands
}

export const get_file_associations$: TMaokaJab<() => Ordo.FileAssociation.Instance[]> = ({ use }) => {
	const { file_associations$ } = use(ordo_context.consume)

	return use(happy_marriage$(file_associations$, x => x.value))
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

export const get_current_route$: TMaokaJab<() => Ordo.Router.Route | undefined> = ({ use }) => {
	const { router$ } = use(ordo_context.consume)

	return use(happy_marriage$(router$, state => state.current_route))
}

export const get_route_params$: TMaokaJab<() => Record<string, string>> = ({ use }) => {
	const get_current_route = use(get_current_route$)

	return () => get_current_route()?.params ?? {}
}

export const happy_marriage$ = <$TState extends Record<string, unknown>, $TResult = $TState>(
	zags: TZags<$TState>,
	handler: (state: $TState) => $TResult = x => x as unknown as $TResult,
): TMaokaJab<() => $TResult> => {
	const storage: WeakMap<TMaokaElement, $TResult> = new WeakMap()

	return ({ on_unmount, refresh, element }) => {
		const divorce = zags.marry(state => {
			const updated_state = handler(state)

			if (!storage.has(element) || !deep_equals(storage.get(element), updated_state)) {
				storage.set(element, updated_state)
				void refresh()
			}
		})

		on_unmount(() => {
			storage.delete(element)
			divorce()
		})

		return () => storage.get(element)!
	}
}

export const get_translations$: TMaokaJab<{ t: Ordo.I18N.TranslateFn }> = ({ use, refresh }) => {
	const { translate } = use(ordo_context.consume)

	translate.$.marry((_, is_update) => {
		if (is_update) return
		void refresh()
	})

	return { t: translate }
}

// --- Metadata ---
// TODO Add error logging

export const get_metadata$ =
	(options?: Ordo.Metadata.QueryOptions): TMaokaJab<() => Ordo.Metadata.Instance[]> =>
	({ use }) => {
		const metadata_query = use(get_metadata_query)

		return use(happy_marriage$(metadata_query.$, () => metadata_query.get(options).cata(R.catas.or_else(() => []))))
	}

export const get_metadata_by_fsid$ =
	(fsid?: Ordo.Metadata.FSID | null, options?: Ordo.Metadata.QueryOptions): TMaokaJab<() => Ordo.Metadata.Instance | null> =>
	({ use }) => {
		const metadata_query = use(get_metadata_query)

		return use(
			happy_marriage$(metadata_query.$, () => {
				if (!fsid) return null

				return metadata_query.get_by_fsid(fsid, options).cata(R.catas.or_else(() => null))
			}),
		)
	}

export const get_metadata_has_children$ =
	(fsid?: Ordo.Metadata.FSID | null, options?: Ordo.Metadata.QueryOptions): TMaokaJab<() => boolean> =>
	({ use }) => {
		const metadata_query = use(get_metadata_query)

		return use(
			happy_marriage$(metadata_query.$, () => {
				if (!fsid) return false

				return metadata_query.has_children(fsid, options).cata(R.catas.or_else(() => false))
			}),
		)
	}

export const get_metadata_children$ =
	(fsid?: Ordo.Metadata.FSID | null, options?: Ordo.Metadata.QueryOptions): TMaokaJab<() => Ordo.Metadata.Instance[]> =>
	({ use }) => {
		const metadata_query = use(get_metadata_query)

		return use(
			happy_marriage$(metadata_query.$, () => {
				if (!fsid) return []

				return metadata_query.get_children(fsid, options).cata(R.catas.or_else(() => []))
			}),
		)
	}
