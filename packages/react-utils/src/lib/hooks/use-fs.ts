import { fsDriver$, drive$ } from "@ordo-pink/stream-drives"
import { useSubscription } from "./use-subscription"

export const useFsDriver = () => {
  return useSubscription(fsDriver$)
}

export const useDrive = () => {
  return useSubscription(drive$)
}
