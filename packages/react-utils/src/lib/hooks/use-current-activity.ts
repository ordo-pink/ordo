import { Activity, Nullable } from "@ordo-pink/common-types"
import { currentActivity$ } from "@ordo-pink/stream-extensions"
import { useState, useEffect } from "react"

export const useCurrentActivity = () => {
  const [activity, setActivity] = useState<Nullable<Activity>>(null)

  useEffect(() => {
    currentActivity$.subscribe((a) => {
      setActivity(a)
    })
  }, [])

  return activity
}
