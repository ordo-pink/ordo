import { useEffect, useState } from "react"
import { BehaviorSubject, Observable } from "rxjs"
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

export const wieldSubscription = <T>(observable: Observable<T>, initialState: T) => {
  const subject = new BehaviorSubject<T>(initialState)

  const sub = observable.subscribe(subject)
  sub.unsubscribe()

  return subject.getValue()
}
