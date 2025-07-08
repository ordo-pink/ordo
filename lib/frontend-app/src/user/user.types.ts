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

export namespace AuthenticatingUser {
	export type State = {
		email: string
		code: string
	}
}

declare global {
	interface t {
		user: {
			rrr: {
				invalid_code_length: string
				invalid_email_length: string
				invalid_email: string
			}
			workspace: {
				current: {
					activity_name: string

					achievements: { title: string; message: string }
					danger_zone: {
						hint: string
						remove_account: string
						remove_content: string
						rrr_message: string
						rrr_title: string
						title: string
					}
					email: { title: string }
					handle: { title: string }
					name: { title: string }
					sessions: { title: string; remove: string }
					settings: { title: string; message: string }
					two_factor_auth: { title: string; message: string }
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
				go_to_account: {
					description: string
					name: string
				}
			}
			common: {
				edit: string
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
