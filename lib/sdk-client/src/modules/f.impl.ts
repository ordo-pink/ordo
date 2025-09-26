import { Zags, zags } from "@ordo-pink/oss-zags"
import type { Aist } from "@ordo-pink/oss-aist"
import type { Hunt } from "@ordo-pink/oss-hunt"
import type { I18n } from "@ordo-pink/oss-i18n"

// TODO Compose queries into a single zags with what is permitted instead of providing them separately
export const create: OrdoClient.F.Create = (name, permissions, callback) => async global_state => {
	const logger: Ordo.Logger = {
		alert: (...message) => global_state.logger.alert(`f(${name}) =>`, ...message),
		crit: (...message) => global_state.logger.crit(`f(${name}) =>`, ...message),
		debug: (...message) => global_state.logger.debug(`f(${name}) =>`, ...message),
		error: (...message) => global_state.logger.error(`f(${name}) =>`, ...message),
		info: (...message) => global_state.logger.info(`f(${name}) =>`, ...message),
		notice: (...message) => global_state.logger.notice(`f(${name}) =>`, ...message),
		panic: (...message) => global_state.logger.alert(`f(${name}) =>`, ...message),
		warn: (...message) => global_state.logger.warn(`f(${name}) =>`, ...message),
	}

	const state: OrdoClient.F.State = {
		fetch: (...args) => {
			if (!permissions.queries.includes("fetch")) return Promise.reject(ordo.rrr.eperm("f_rrr_not_permitted_fetch"))
			return global_state.fetch(...args)
		},
		hosts: (() => {
			if (!permissions.queries.includes("hosts")) return {} as Ordo.Hosts

			return global_state.hosts
		})(),
		logger,
		hunter: {
			shoot: (prey, bullet) => {
				if (!permissions.commands.includes(prey)) throw ordo.rrr.eperm("f_rrr_not_permitted_shot", prey)

				return global_state.hunter.shoot(prey, bullet as any)
			},
			track: global_state.hunter.track,
		},
		activities$: (() => {
			if (!permissions.queries.includes("activities$")) return zags.create({}) as any

			return {
				...global_state.activities$,
				each: direct_zags_update_not_permitted,
				replace: direct_zags_update_not_permitted,
				update: direct_zags_update_not_permitted,
			}
		})(),
		auth$: (() => {
			if (!permissions.queries.includes("auth$")) return zags.create({}) as any

			return {
				...global_state.auth$,
				each: direct_zags_update_not_permitted,
				replace: direct_zags_update_not_permitted,
				update: direct_zags_update_not_permitted,
			}
		})(),
		i18n$: (() => {
			if (!permissions.queries.includes("i18n$")) return zags.create({}) as any

			return {
				...global_state.i18n$,
				each: direct_zags_update_not_permitted,
				replace: direct_zags_update_not_permitted,
				update: direct_zags_update_not_permitted,
			}
		})(),
		aist$: (() => {
			if (!permissions.queries.includes("aist$")) return zags.create({}) as any

			return {
				...global_state.aist$,
				each: direct_zags_update_not_permitted,
				replace: direct_zags_update_not_permitted,
				update: direct_zags_update_not_permitted,
			}
		})(),
	}

	const destroy = await callback(state)

	return async () => {
		if (ordo.validations.is_fn(destroy)) {
			await destroy()
		}
	}
}

declare global {
	namespace OrdoClient.F {
		// TODO permissions for data and user queries
		export type Blessing = Exclude<keyof State, "hunter">

		export type HuntingTicket = keyof Hunt.ToPreys<OrdoClient.Command.Preys>

		export type Permissions = {
			queries: Blessing[]
			commands: HuntingTicket[]
		}

		export type State = {
			activities$: Zags.Instance<OrdoClient.Activity.State>
			auth$: Zags.Instance<{ user?: Ordo.User.Instance }>
			fetch: OrdoClient.Fetch
			hosts: Ordo.Hosts
			hunter: OrdoClient.Command.Hunter
			i18n$: I18n.Zags<OrdoClient.Translations.Keys>
			logger: Ordo.Logger
			aist$: Aist.Stream
		}

		export type Instance = (state: State) => Promise<() => void | Promise<void>>

		export type Create = (
			name: string,
			permissions: Permissions,
			callback: (state: State) => void | Promise<void> | (() => void | Promise<void>) | Promise<() => void | Promise<void>>,
		) => Instance
	}
}

const direct_zags_update_not_permitted = () => ordo.rrr.eperm("f_rrr_not_permitted_direct_zags_update")
