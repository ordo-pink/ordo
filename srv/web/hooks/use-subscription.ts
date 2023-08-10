import type { Nullable } from "#lib/tau/mod.ts"

import { Observable } from "#x/rxjs@v1.0.2/mod.ts"
import { useState, useEffect } from "preact/hooks"

export const useSubscription = <T>(observable: Observable<T>, initialState?: T) => {
	const [state, setState] = useState<typeof initialState extends undefined ? Nullable<T> : T>(
		initialState ?? (null as unknown as T)
	)

	useEffect(() => {
		const subscription = observable.subscribe(value => setState(value))

		return () => {
			subscription.unsubscribe()
		}
	}, [observable])

	return state
}
