/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { type Zags, zags } from "@ordo-pink/oss-zags"
import type { Aist } from "@ordo-pink/oss-aist"
import type { Hunt } from "@ordo-pink/oss-hunt"
import type { I18n } from "@ordo-pink/oss-i18n"

export namespace impl {
	// TODO Compose queries into a single zags with what is permitted instead of providing them separately
	export const create: OrdoClient.F.Create = (name, permissions, callback) => async global_state => {
		let query = zags.create({} as OrdoClient.F.State)

		for (const permission of permissions.queries) {
			if (permission.type === "i18n") query = query.concat(global_state.i18n$)
			if (permission.type === "user") query = query.concat(global_state.user$)
			if (permission.type === "router") query = query.concat(global_state.aist$)
		}

		const state: OrdoClient.F.State = {
			fetch: (...args) => {
				const fetch_permission = permissions.queries.find(p => p.type === "fetch")

				if (!fetch_permission) return Promise.reject(ordo.rrr.eperm("f_rrr_not_permitted_fetch"))

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

				return Promise.reject(ordo.rrr.eperm("f_rrr_not_permitted_fetch"))
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
					if (!permissions.commands.includes(prey)) throw ordo.rrr.eperm("f_rrr_not_permitted_shot", prey)

					return global_state.hunter.shoot(prey, bullet as any)
				},
				track: global_state.hunter.track,
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
		// TODO permissions for data and user queries

		type FetchPermission = {
			type: "fetch"
			destinations: { url: string; method: "get" | "head" | "post" | "put" | "patch" | "delete" | "options" }[]
		}

		type SettingsPermission = { type: "settings"; access: "f" | "all" }

		type I18nPermission = { type: "i18n" }

		type AchievementsPermission = { type: "achievements" }

		type UserPermission = { type: "user"; details: ("is_authenticated" | "name" | "email" | "id" | "handle" | "created_at")[] }

		type DataPermission = { type: "data"; details: ("metadata" | "custom_metadata" | "content")[] }

		type RouterPermission = { type: "router" }

		type QueryPermission =
			| FetchPermission
			| SettingsPermission
			| I18nPermission
			| AchievementsPermission
			| UserPermission
			| RouterPermission

		type HuntingTicket = keyof Hunt.ToPreys<OrdoClient.Command.Preys>

		type Permissions = {
			queries: QueryPermission[]
			commands: HuntingTicket[]
		}

		type InternalState = {
			hunter: OrdoClient.Command.Hunter
			logger: Ordo.Logger
			fetch: OrdoClient.Fetch
			activity$: Zags.Instance<OrdoClient.Activity.State>
			i18n$: I18n.Stream
			aist$: Aist.Stream
			data$: Zags.Instance<{ data: Ordo.Data.Instance[] }>
			user$: Zags.Instance<{ user?: Ordo.User.Instance }>
			// workspace$
			// context_menu$
			// modal$
			// notification$
			// background_task$
			// achievement$
			// command_palette$
			// file_association$
			// settings$
			// installed_fs$
			// session$
		}

		export type State = {
			hunter: OrdoClient.Command.Hunter
			logger: Ordo.Logger
			fetch: OrdoClient.Fetch
			query: OrdoClient.Query
		}

		export type Instance = (state: InternalState) => Promise<() => void | Promise<void>>

		export type Create = (
			name: string,
			permissions: Permissions,
			callback: (
				state: OrdoClient.F.State,
			) => void | Promise<void> | (() => void | Promise<void>) | Promise<() => void | Promise<void>>,
		) => Instance
	}
}
