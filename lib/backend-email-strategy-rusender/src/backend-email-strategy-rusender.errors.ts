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

export const InvalidRequestBodyErrorCode = 400

export const InvalidAPIKeyErrorCode = 401

export const BalanceDrainedErrorCode = 402

export const DomainVerificationFailedErrorCode = 403

export const UserDomainApiKeyNotFoundErrorCode = 404

export const UserUnsubscribedErrorCode = 422

export const ServiceTemporaryUnavailableErrorCode = 503

export type EmailStrategyRusenderError =
	| typeof InvalidRequestBodyErrorCode
	| typeof InvalidAPIKeyErrorCode
	| typeof BalanceDrainedErrorCode
	| typeof DomainVerificationFailedErrorCode
	| typeof UserDomainApiKeyNotFoundErrorCode
	| typeof UserUnsubscribedErrorCode
	| typeof ServiceTemporaryUnavailableErrorCode
