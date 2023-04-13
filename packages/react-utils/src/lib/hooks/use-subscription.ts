import { useEffect, useState } from "react"
import { Observable } from "rxjs"
import { Nullable } from "vitest"

export const useSubscription = <T>(observable: Observable<T>, initialState?: T) => {
  const [state, setState] = useState<typeof initialState extends undefined ? Nullable<T> : T>(
    initialState ?? (null as unknown as T),
  )

  useEffect(() => {
    const subscription = observable.subscribe((value) => setState(value))

    return () => {
      subscription.unsubscribe()
    }
  }, [observable])

  return state
}
