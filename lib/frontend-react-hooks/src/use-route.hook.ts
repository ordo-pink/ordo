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

import { Result } from "@ordo-pink/result"
import { keys_of } from "@ordo-pink/tau"

import { useOrdoContext } from "./use-ordo-context.hook"
import { useSubscription } from "./use-subscription.hook"

export const useRouteParams = <
	$TExpectedRouteParams extends Record<string, string | undefined> = Record<
		string,
		string | undefined
	>,
>(): Partial<$TExpectedRouteParams> => {
	const { get_current_route } = useOrdoContext()

	const current_route$ = get_current_route().cata({
		Ok: x => x,
		Err: () => null, // TODO: Show permission error
	})

	const route = useSubscription(current_route$)

	return Result.FromNullable(route)
		.pipe(Result.ops.chain(Result.FromOption))
		.pipe(Result.ops.chain(route => Result.FromNullable(route.params)))
		.cata({
			Err: () => ({}),
			Ok: params =>
				keys_of(params).reduce(
					(acc, key) => ({
						...acc,
						[key]: params[key] ? decodeURIComponent((params as any)[key]) : void 0,
					}),
					{},
				),
		})
}
