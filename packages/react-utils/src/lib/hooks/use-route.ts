import { Nullable, Route } from "@ordo-pink/common-types"
import { currentRoute$ } from "@ordo-pink/stream-extensions"
import { useEffect, useState } from "react"

export const useRoute = () => {
  const [route, setRoute] = useState<Nullable<Route>>(null)

  useEffect(() => {
    const subscription = currentRoute$.subscribe(setRoute)

    return () => subscription.unsubscribe()
  }, [])

  return route
}
