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
import type { TPersistenceStrategyToken } from "@ordo-pink/backend-service-token"
import type { TPersistenceStrategyUser } from "@ordo-pink/backend-service-user"

export type TIDChamber = {
	logger: TLogger
	// TODO FS Strategy
	user_persistence_strategy: TPersistenceStrategyUser // TODO
	// TODO FS Strategy
	token_persistence_strategy: TPersistenceStrategyToken // TODO
}

export type TSharedContext<$TPayload = unknown> = TIDChamber & {
	response_timer?: [number, number]
	response_time?: string
	payload?: $TPayload
	status: number
	headers: Record<string, string>
	request_ip: SocketAddress | null
}
