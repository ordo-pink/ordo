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
