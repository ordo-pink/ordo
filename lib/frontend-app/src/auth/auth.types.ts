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

import type { User } from "@ordo-pink/sdk-core"

export namespace Auth {
	export type State = {
		user?: User.Current.Instance
		email: string
		code: string
	}
}

declare global {
	interface t {
		auth: {
			rrr: {
				invalid_code_length: string
				invalid_email_length: string
				invalid_email: string
			}
			workspace: {
				current: {
					activity_name: string
				}
				other: {
					activity_name: string
				}
			}
			commands: {
				join: {
					description: string
					name: string
				}
				sign_out: {
					description: string
					name: string
				}
			}
			common: {
				cancel: string
			}
			modals: {
				join: {
					hint: string
					join: string
					placeholder: string
					title: string
				}
				verify: {
					hint: string
					placeholder: string
					submit: string
					title: string
				}
			}
		}
	}
}
