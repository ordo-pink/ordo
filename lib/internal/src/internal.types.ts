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

import { TOption } from "@ordo-pink/option"

export type TRequireFID<$TReturn> = (fid: symbol | null) => $TReturn

declare global {
	module OrdoInternal {
		type KnownFunction = {
			name: string
			fid: symbol
			permissions: Ordo.CreateFunction.Permissions
		}

		module User {
			export type InternalDTO = Ordo.User.Current.DTO & {
				email_code: string
			}

			export type PrivateDTO = User.InternalDTO & {
				password: string
				entity_version: number
			}

			export type V0 = {
				email: string
				createdAt: Date
				subscription: string
				firstName: string
				lastName: string
				id: Ordo.User.ID
				emailConfirmed: boolean
				fileLimit: number
				maxUploadSize: number
				code: string
				password: string
			}
		}

		type KnownFunctions = {
			validate: (fid: symbol | null) => boolean
			exchange: (fid: symbol | null) => TOption<string>
			is_internal: (fid: symbol | null) => boolean
			has_permissions: (fid: symbol | null, permissions: Partial<Ordo.CreateFunction.Permissions>) => boolean
			register: (name: string | null, permissions: Ordo.CreateFunction.Permissions) => symbol | null
			unregister: (name: string | null) => boolean
		}

		type TFIDAwareActivity = Ordo.Activity.Instance & { fid: symbol }
	}
}
