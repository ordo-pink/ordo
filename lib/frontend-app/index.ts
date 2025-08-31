/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2024  谢尔盖 ||↓ and the Ordo.pink contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import * as maoka from "@ordo-pink/oss-maoka"
import { type Core, core } from "@ordo-pink/sdk-core"
import { type ClientSDK } from "@ordo-pink/sdk-client"
import { client_maoka } from "@ordo-pink/sdk-client-maoka"
import { hunt } from "@ordo-pink/oss-hunt"
import maoka_styled from "@ordo-pink/oss-maoka/styled"

import { auth_jab } from "./src/state/auth"
import { background_task_status } from "./src/sections/background-task"
import { create_activity_bar_jab } from "./src/sections/activity-bar"
import { create_command_palette_jab } from "./src/sections/command-palette"
import { create_i18n_jab } from "./src/state/i18n"
import { create_modal_jab } from "./src/sections/modal"
import { create_notifications_jab } from "./src/sections/notifications"
import { create_rotor_jab } from "./src/state/aist"
import { create_sidebar_jab } from "./src/sections/workspace"
import { create_user_jab } from "./src/activities/user"
import { init_activities_jab } from "./src/state/activities"
import { title } from "./src/sections/window-title"

import "./index.css"

// TODO Move fonts to assets
// TODO Move types
export type AppOptions = {
	hosts: Core.Hosts
	local_persistence_strategy: null
	logger: Core.Logger
}

const native_fetch = window.fetch

globalThis.window.fetch = undefined as any
globalThis.XMLHttpRequest = undefined as any
globalThis.XMLHttpRequestUpload = undefined as any

export const app = maoka.create<AppOptions>("div", ({ hosts, logger, use }) => {
	const fn_disablers = {} as Record<Core.User.InstalledFunction, void | (() => void | Promise<void>)>
	const hunter = hunt.begin<ClientSDK.Preys>()
	const fetch: ClientSDK.Fetch = (input, init) => {
		hunter.shoot(
			!init || !init.method || init.method === "GET" || init.method === "HEAD"
				? "background_status.loading"
				: "background_status.saving",
		)

		return native_fetch(input, init)
	}

	const aist$ = use(create_rotor_jab(hunter))
	const i18n$ = use(create_i18n_jab(hunter))
	const activities$ = use(init_activities_jab(hunter, aist$))
	const auth$ = use(auth_jab(fetch, hosts, hunter))

	const state = { auth$, fetch, hosts: Object.freeze(hosts), hunter, logger, aist$, i18n$, activities$ }

	use(client_maoka.context.provide(state))
	use(client_maoka.jabs.register_translations("en", en_rrr_codes))
	use(create_user_jab)

	const modal = use(create_modal_jab)
	const { command_palette, command_palette_toggle } = use(create_command_palette_jab)
	const { sidebar, sidebar_toggle, workspace } = use(create_sidebar_jab)
	const activity_bar = use(create_activity_bar_jab(command_palette_toggle, sidebar_toggle))
	const notifications = use(create_notifications_jab)

	use(
		maoka.dom.jabs.onmount(async () => {
			// TODO Store fns locally
			await import("@ordo-pink/function-landing")
				.then(m => m.default)
				.then(f => f(state))
				.then(core.fns.v)
				.catch(logger.error)

			const divorce_user = auth$.cheat("user", async u => {
				const registered_fns = core.fns.keys_of(fn_disablers)

				if (u) {
					const fns = core.user.get_installed_functions(u)

					if (!registered_fns.length) {
						for (const fn of fns) {
							// TODO Store fns locally
							const disable_fn = await import(`${hosts.fn}/${fn}`)
								.then(m => m.default)
								.then((f: ClientSDK.F.Instance) => f(state))
								.catch(logger.error)

							fn_disablers[fn] = disable_fn
						}
					} else {
						let needs_reload = false

						for (const fn of registered_fns) {
							if (!fns.includes(fn)) {
								needs_reload = true
								if (fn_disablers[fn]) await fn_disablers[fn]()
							}
						}

						if (needs_reload) {
							window.location.reload()
						} else {
							for (const fn of fns) {
								if (registered_fns.includes(fn)) continue

								// TODO Store fns locally
								const disable_fn = await import(`${hosts.fn}/${fn}`)
									.then(m => m.default)
									.then((f: ClientSDK.F.Instance) => f(state))
									.catch(logger.error)

								fn_disablers[fn] = disable_fn
							}
						}
					}
				} else {
					// for (const fn of registered_fns) {
					// 	if (fn_disablers[fn]) await fn_disablers[fn]()
					// }
					// window.location.reload()
				}
			})

			return () => {
				divorce_user()
			}
		}),
	)

	return () => [
		title(),
		screen_wrapper(() => [workspace(), sidebar()]),
		activity_bar(),
		background_task_status(),
		modal(),
		command_palette(),
		notifications(),
	]
})

const screen_wrapper = maoka_styled.div("app")

const en_rrr_codes = {
	loading_title: "Loading...",
	rrr_codes_EACCES: "Access Denied",
	rrr_codes_EAGAIN: "Try Later",
	rrr_codes_EEXIST: "Already Exists",
	rrr_codes_EFBIG: "File Too Big",
	rrr_codes_EINTR: "Operation Interrupted",
	rrr_codes_EINVAL: "No!",
	rrr_codes_EIO: "Connection Error",
	rrr_codes_ENOENT: "Not Found",
	rrr_codes_ENOSPC: "Total File Limit Reached",
	rrr_codes_ENXIO: "Invalid Address Used",
	rrr_codes_EPERM: "Permission Denied",
	rrr_codes_EUNKNOWN: "Unknown Error",
	rrr_codes_length: "42",
}
