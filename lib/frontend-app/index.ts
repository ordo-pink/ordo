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

import type { CoreSDK, Logger } from "@ordo-pink/sdk-core"
import { type ClientSDK } from "@ordo-pink/sdk-client"
import { context } from "@ordo-pink/sdk-maoka"
import { hunt } from "@ordo-pink/hunt"
import { maoka } from "@ordo-pink/maoka"

import { auth_jab } from "./src/auth"
import { create_activity_bar_jab } from "./src/activity-bar"
import { create_background_task_status_jab } from "./src/background-task"
import { create_command_palette_jab } from "./src/command-palette"
import { create_i18n_jab } from "./src/i18n"
import { create_modal_jab } from "./src/modal"
import { create_notifications_jab } from "./src/notifications"
import { create_rotor_jab } from "./src/rotor"

import "./index.css"

// TODO Move fonts to assets
// TODO Move types
export type AppOptions = {
	hosts: CoreSDK.Hosts
	local_persistence_strategy: null
	logger: Logger
}

const native_fetch = window.fetch

globalThis.window.fetch = undefined as any
globalThis.XMLHttpRequest = undefined as any
globalThis.XMLHttpRequestUpload = undefined as any

export const app = maoka.create<AppOptions>("div", ({ hosts, logger, use }) => {
	const hunter = hunt.begin<ClientSDK.Preys>()
	const rotor$ = use(create_rotor_jab(hunter))
	const i18n$ = use(create_i18n_jab(hunter))
	const fetch: ClientSDK.Fetch = (input, init) => {
		hunter.shoot(
			!init || !init.method || init.method === "GET" || init.method === "HEAD"
				? "background_status.loading"
				: "background_status.saving",
		)

		return native_fetch(input, init)
	}

	hunter.shoot("i18n.add_translations", {
		locale: "en",
		values: {
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
		},
	})

	use(context.provide({ fetch, hosts: Object.freeze(hosts), hunter, logger, rotor$, i18n$ }))
	use(auth_jab)

	const modal = use(create_modal_jab)
	const command_palette = use(create_command_palette_jab)
	const background_task_status = use(create_background_task_status_jab)
	const activity_bar = use(create_activity_bar_jab)
	const notifications = use(create_notifications_jab)

	return () => [activity_bar(), background_task_status(), modal(), command_palette(), notifications()]
})
