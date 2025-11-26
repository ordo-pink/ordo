/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { type Zags, zags } from "@ordo-pink/oss-zags"
import type { Aist } from "@ordo-pink/oss-aist"
import type { Hunt } from "@ordo-pink/oss-hunt"
import type { I18n } from "@ordo-pink/oss-i18n"

export namespace impl {
	export const create: OrdoClient.F.Create = (name, permissions, callback) => async global_state => {
		if (name.startsWith("ordo_main")) throw ordo.rrr.einval(ORDO.RRR.REASON.RESERVED_F_NAME, name)

		const query = zags.create({
			activities: { items: [] },
			data: { root: {}, vaults: {} },
			i18n: { locale: "", values: {} },
			router: { hash: "", pathname: "", search: "" },
		} as unknown as OrdoClient.F.QueryState)

		const divorces = [] as (() => void)[]

		for (const permission of permissions.queries) {
			if (permission.type === "i18n")
				divorces.push(global_state.query.cheat("i18n", state => query.update("i18n", () => state)))

			if (permission.type === "router")
				divorces.push(global_state.query.cheat("router", state => query.update("router", () => state)))

			if (permission.type === "activities" && permission.details.includes("current"))
				divorces.push(global_state.query.cheat("activities.current", state => query.update("activities.current", () => state)))

			if (permission.type === "activities" && permission.details.includes("all"))
				divorces.push(global_state.query.cheat("activities.items", state => query.update("activities.items", () => state)))

			if (permission.type === "data")
				divorces.push(global_state.query.cheat("data", state => query.update("data", () => state)))
		}

		const state: OrdoClient.F.State = {
			name,
			fetch: (...args) => {
				const fetch_permission = permissions.queries.find(p => p.type === "fetch")

				if (!fetch_permission) return Promise.reject(ordo.rrr.eperm(ORDO.RRR.REASON.FETCH_NOT_PERMITTED, null))

				const url = args[0] instanceof Request ? args[0].url : args[0]
				const requested_method = args[1] ? (args[1].method ?? "get") : args[0] instanceof Request ? args[0].method : "get"
				const requested_url = new URL(url)

				if (requested_url.protocol === "http:") return Promise.reject("f_rrr_insecure_connection")

				for (const destination of fetch_permission.destinations) {
					if (requested_method.toLowerCase() !== destination.method.toLowerCase()) continue

					const allowed_url = new URL(destination.url)

					if (allowed_url.host === requested_url.host || allowed_url.pathname === requested_url.pathname)
						return global_state.fetch(...args)
				}

				return Promise.reject(ordo.rrr.eperm(ORDO.RRR.REASON.FETCH_NOT_PERMITTED, null))
			},

			logger: {
				alert: (...message) => global_state.logger.alert(`f(${name}) =>`, ...message),
				crit: (...message) => global_state.logger.crit(`f(${name}) =>`, ...message),
				debug: (...message) => global_state.logger.debug(`f(${name}) =>`, ...message),
				error: (...message) => global_state.logger.error(`f(${name}) =>`, ...message),
				info: (...message) => global_state.logger.info(`f(${name}) =>`, ...message),
				notice: (...message) => global_state.logger.notice(`f(${name}) =>`, ...message),
				panic: (...message) => global_state.logger.alert(`f(${name}) =>`, ...message),
				warn: (...message) => global_state.logger.warn(`f(${name}) =>`, ...message),
			},

			hunter: {
				shoot: (prey, bullet) => {
					if (!permissions.commands.map(ordo.fns.prop("command")).includes(prey))
						global_state.hunter.shoot("ordo_main.notification.rrr", ordo.rrr.eperm("f_rrr_not_permitted_shot", prey))

					return global_state.hunter.shoot(prey, bullet as any)
				},
				track: (prey, gun) => {
					if (prey.startsWith(name)) permissions.commands.push({ command: prey })
					if (!permissions.commands.map(ordo.fns.prop("command")).includes(prey))
						global_state.hunter.shoot("ordo_main.notification.rrr", ordo.rrr.eperm("f_rrr_not_permitted_track", prey))

					return global_state.hunter.track(prey, gun)
				},
			},

			query: query.to_readable(),
		}

		const destroy = await callback(state)

		return async () => {
			if (ordo.validations.is_fn(destroy)) {
				await destroy()
			}
		}
	}
}

declare global {
	namespace OrdoClient.F {
		type Fetch = (input: string | URL | Request, init?: RequestInit) => Promise<Response>

		type FetchPermission = {
			type: "fetch"
			destinations: { url: string; method: "get" | "head" | "post" | "put" | "patch" | "delete" | "options" }[]
		}

		type I18nPermission = { type: "i18n" }

		type DataPermission = { type: "data" }

		type RouterPermission = { type: "router" }

		type ActivityPermission = { type: "activities"; details: ("current" | "all")[] }

		type QueryPermission = FetchPermission | I18nPermission | ActivityPermission | DataPermission | RouterPermission

		type HuntingTicket = { command: keyof Hunt.ToPreys<OrdoClient.Command.Preys> }

		type Permissions = {
			queries: QueryPermission[]
			commands: HuntingTicket[]
		}

		type QueryState = Aist.State & I18n.State & OrdoClient.Activity.State & OrdoClient.Data.State
		type Query = Zags.ReadableInstance<QueryState>

		export type State = {
			name: string
			hunter: OrdoClient.Command.Hunter
			logger: Ordo.Logger
			fetch: Fetch
			query: Query
		}

		export type Instance = (state: State) => Promise<() => void | Promise<void>>

		export type Create = (
			name: string,
			permissions: Permissions,
			callback: (
				state: OrdoClient.F.State,
			) => void | Promise<void> | (() => void | Promise<void>) | Promise<() => void | Promise<void>>,
		) => Instance
	}
}
