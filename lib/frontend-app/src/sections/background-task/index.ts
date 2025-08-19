/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2025  谢尔盖 ||↓ and the Ordo.pink contributors
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

import { BACKGROUND_TASK, type ClientSDK } from "@ordo-pink/sdk-client"
import { type Maoka, maoka } from "@ordo-pink/oss-maoka"
import { client_maoka } from "@ordo-pink/sdk-client-maoka"

import { background_task$ } from "./background-task.state"
import { background_task_status } from "./components/background-task-status.component"

import "./background-task.styles.css"

export const create_background_task_status_jab: Maoka.Jab<() => Maoka.Component> = ({ use }) => {
	const { hunter } = use(client_maoka.context.consume)

	const handle_onmount = () => {
		const release_loading = hunter.track("background_status.loading", handle_loading)
		const release_none = hunter.track("background_status.none", handle_none)
		const release_saving = hunter.track("background_status.saving", handle_saving)

		return () => {
			release_loading()
			release_none()
			release_saving()
		}
	}

	use(maoka.dom.jabs.onmount(handle_onmount))

	return () => background_task_status()
}

// --- Internal ---

const handle_saving: ClientSDK.GunFor<"background_status.saving"> = () =>
	background_task$.update("status", () => BACKGROUND_TASK.STATUS.SAVING)

const handle_none: ClientSDK.GunFor<"background_status.none"> = () =>
	background_task$.update("status", () => BACKGROUND_TASK.STATUS.NONE)

const handle_loading: ClientSDK.GunFor<"background_status.loading"> = () =>
	background_task$.update("status", () => BACKGROUND_TASK.STATUS.LOADING)
