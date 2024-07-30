// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { use$ } from ".."

// TODO:
const or_else = <N, B, T>(on_err: (x: B) => N) => ({
	Ok: (x: T) => x,
	Err: on_err,
})

export const useIsAuthenticated = () => {
	const { get_is_authenticated } = use$.ordo_context()
	const is_dev = use$.is_dev()
	const logger = use$.logger()

	const is_authenticated$ = get_is_authenticated().cata(
		or_else(() => {
			// TODO: Only show in is_dev mode
			is_dev &&
				logger.alert("Permission for checking if the user is authenticated is not requested.")
			return null
		}),
	)

	return use$.strict_subscription(is_authenticated$, false)
}
