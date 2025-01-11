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

import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { Switch } from "@ordo-pink/switch"
import { type TMaokaJab } from "@ordo-pink/maoka"
import { noop } from "@ordo-pink/tau"

import { DataManager } from "../frontend-app.data-manager"

type P = { metadata: Ordo.Metadata.Repository; content: Ordo.Content.Repository }
export const start_data_orchestrator =
	(repositories: P): TMaokaJab =>
	async ({ use, on_unmount }) => {
		const commands = use(MaokaOrdo.Jabs.get_commands)

		const data_manager = DataManager.Of(repositories.metadata, repositories.content)

		await data_manager.start(state_change =>
			Switch.Match(state_change)
				.case("get-remote", () => commands.emit("cmd.application.background_task.start_loading"))
				.case("put-remote", () => commands.emit("cmd.application.background_task.start_saving"))
				.case("get-remote-complete", () => commands.emit("cmd.application.background_task.reset_status"))
				.case("put-remote-complete", () => commands.emit("cmd.application.background_task.reset_status"))
				.default(noop),
		)

		on_unmount(() => {
			data_manager.cancel()
		})
	}
