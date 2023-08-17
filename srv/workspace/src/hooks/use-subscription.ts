import { useState, useEffect } from "react"
import { Observable } from "rxjs"
import type { Nullable } from "#lib/tau/mod"

export const useSubscription = <T>(observable: Nullable<Observable<T>>) => {
	const [state, setState] = useState<Nullable<T>>(null)

	useEffect(() => {
		if (!observable) return

		const subscription = observable.subscribe(value => setState(value))

		return () => subscription.unsubscribe()
	}, [observable])

	return state
}

export const useStrictSubscription = <T>(observable: Nullable<Observable<T>>, initialState: T) => {
	const [state, setState] = useState(initialState)

	useEffect(() => {
		if (!observable) return

		const subscription = observable.subscribe(value => setState(value))

		return () => subscription.unsubscribe()
	}, [observable])

	return state
}