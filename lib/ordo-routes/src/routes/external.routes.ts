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

import { ExternalEndpoints, OrdoRouteMap } from "../ordo-routes.types"

const method = "GET"
const authenticated = false
const createHandler = () => ({}) as any
const GITHUB_SOURCE = "https://github.com/ordo-pink"
const GITHUB_LICENSE = "https://github.com/ordo-pink/ordo/blob/main/license.md"
const X_COM_ACCOUNT = "https://x.com/ordo_pink"
const TG_SUPPORT_CIS = "https://t.me/ordo_pink_ru"

export const External: OrdoRouteMap<ExternalEndpoints> = {
	SourceCode: {
		createHandler,
		prepareRequest: () => ({ method, authenticated, url: GITHUB_SOURCE }),
	},
	TwitterX: {
		createHandler,
		prepareRequest: () => ({ method, authenticated, url: X_COM_ACCOUNT }),
	},
	TelegramSupportCIS: {
		createHandler,
		prepareRequest: () => ({ method, authenticated, url: TG_SUPPORT_CIS }),
	},
	License: {
		createHandler,
		prepareRequest: () => ({ method, authenticated, url: GITHUB_LICENSE }),
	},
}
