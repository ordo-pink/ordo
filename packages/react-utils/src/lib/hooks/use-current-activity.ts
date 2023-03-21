import { Activity } from "@ordo-pink/common-types"
import { currentActivity$ } from "@ordo-pink/stream-extensions"
import { useState, useEffect } from "react"
import { Nullable } from "vitest"

export const useCurrentActivity = () => {
  const [activity, setActivity] = useState<Nullable<Activity>>(null)

  useEffect(() => {
    currentActivity$.subscribe(setActivity)
  }, [])

  return activity
}
