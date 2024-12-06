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

import type { JTI, SUB } from "@ordo-pink/wjwt"
import type { TEmailContact, TEmailStrategy, TNotificationService } from "@ordo-pink/backend-service-offline-notifications"
import type { TPersistenceStrategyToken, TTokenService, TTokenServiceOptions } from "@ordo-pink/backend-service-token"
import type { TPersistenceStrategyUser, TUserService } from "@ordo-pink/backend-service-user"
import type { TLogger } from "@ordo-pink/logger"

export type AuthResponse = {
	token: string
	jti: JTI
	sub: SUB
	fileLimit: number
	maxUploadSize: number
}

export type TCreateIDServerFnParams = {
	user_persistence_strategy: TPersistenceStrategyUser
	token_persistence_strategy: TPersistenceStrategyToken
	email_strategy: TEmailStrategy
	origin: string | string[]
	logger: TLogger
	website_host: string
	notification_sender: Required<TEmailContact>
	token_service_options: TTokenServiceOptions
}

export type THandlerParams = {
	user_service: TUserService
	token_service: TTokenService
	notification_service: TNotificationService
	website_host: string
	logger: TLogger
}
