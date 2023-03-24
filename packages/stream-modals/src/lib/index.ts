import { Nullable, UnaryFn } from "@ordo-pink/common-types"
import { callOnce } from "@ordo-pink/fns"
import { Logger } from "@ordo-pink/logger"
import { ComponentType } from "react"
import { BehaviorSubject, tap } from "rxjs"

export const modal$ = new BehaviorSubject<Nullable<ComponentType>>(null)

export const _initModals = callOnce((logger: Logger) => {
  modal$
    .pipe(tap((state) => (state ? logger.debug("Modal shown") : logger.debug("Modal hidden"))))
    .subscribe()

  return modal$
})

export const showModal: UnaryFn<ComponentType, void> = (Component) => {
  modal$.next(Component)
}

export const hideModal = () => {
  modal$.next(null)
}
