import { tap } from "ramda"

export const preventDefault = (event: Event) => event.preventDefault()
export const stopPropagation = (event: Event) => event.stopPropagation()
export const tapPreventDefault = tap(preventDefault)
export const tapStopPropagation = tap(stopPropagation)
