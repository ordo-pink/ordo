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

import type { Logger } from "@ordo-pink/logger"
import type { RoutaryOrdo } from "@ordo-pink/routary-ordo"

export type TIDChamber = {
	allow_origin: string[]
	defaults: { file_limit: number; max_upload_size: number; max_functions: number }
	logger: Logger
	notification_strategy: OrdoBackend.Notification.EmailStrategy
	session_lifetime: number
	persistence_strategy_user: OrdoBackend.User.PersistenceStrategy
	reference_mapping_user: OrdoBackend.User.ReferenceMapping
	web_host: string
}

export type TIDContext = RoutaryOrdo.Chamber & TIDChamber
