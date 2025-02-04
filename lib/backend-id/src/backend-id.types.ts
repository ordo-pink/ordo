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

import { SocketAddress } from "bun"

import type { TLogger } from "@ordo-pink/logger"
import { TWJWT } from "@ordo-pink/wjwt"

// TODO Move to lib

export type TIDChamber = {
	allow_origin: string[]
	logger: TLogger
	user_persistence_strategy: OrdoBackend.User.PersistenceStrategy
	token_persistence_strategy: OrdoBackend.Token.PersistenceStrategy
	notification_strategy: OrdoBackend.Notification.EmailStrategy
	wjwt: TWJWT
	persisted_token_lifetime: number
	status: number
	headers: Record<string, string>
	defaults: {
		file_limit: number
		max_upload_size: number
		max_functions: number
	}
}

export type TSharedContext<$TPayload = unknown> = TIDChamber & {
	response_timer?: [number, number]
	response_time?: string
	payload?: $TPayload

	request_ip: SocketAddress | null
}
