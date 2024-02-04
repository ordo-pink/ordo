// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Either } from "@ordo-pink/either"
import { useSharedContext } from "@ordo-pink/core"
import { keysOf } from "@ordo-pink/tau"

export const useRouteParams = <
	ExpectedRouteParams extends Record<string, string> = Record<string, string>,
>(): Partial<ExpectedRouteParams> => {
	const { route } = useSharedContext()

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
