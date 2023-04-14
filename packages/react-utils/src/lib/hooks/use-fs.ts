import { Nullable, OrdoDrive } from "@ordo-pink/common-types"
import { fsDriver$, drive$ } from "@ordo-pink/stream-drives"
import { useSubscription } from "./use-subscription"

export const useFsDriver = () => {
  return useSubscription(fsDriver$)
}

export const wieldFsDriver = () => fsDriver$.getValue()

export const useDrive = () => {
  return useSubscription(drive$)
}

export const wieldDrive = () =>
  [drive$.getValue(), (newDrive: Nullable<OrdoDrive>) => drive$.next(newDrive)] as const
