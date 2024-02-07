import { useEffect, useState } from "react"
import { Observable } from "rxjs/internal/Observable"

export const useStrictSubscription = <T>(
	observable: Observable<T | null> | null,
	initialState: T,
): T => {
	const [state, setState] = useState<T>(initialState)

	useEffect(() => {
		if (!observable) return

		const subscription = observable.subscribe(value => setState(value ?? initialState))

		return () => subscription.unsubscribe()
	}, [observable, initialState])

	return state
}
