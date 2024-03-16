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

import { Either } from "@ordo-pink/either"
import { currentRoute$ } from "@ordo-pink/frontend-stream-router"
import { keysOf } from "@ordo-pink/tau"

import { useSubscription } from "./use-subscription.hook"

export const useCurrentRoute = () => {
	const route = useSubscription(currentRoute$)

	return route
}

export const useRouteParams = <
	ExpectedRouteParams extends Record<string, string> = Record<string, string>,
>(): Partial<ExpectedRouteParams> => {
	const route = useCurrentRoute()

	return Either.fromNullable(route)
		.chain(route => Either.fromNullable(route.params))
		.fold(
			() => ({}),
			params =>
				keysOf(params).reduce(
					(acc, key) => ({ ...acc, [key]: decodeURIComponent(params[key]) }),
					{},
				),
		)
}
