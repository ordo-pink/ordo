import { Nullable, ThunkFn } from "@ordo-pink/common-types"
import { callOnce } from "@ordo-pink/fns"
import { Logger } from "@ordo-pink/logger"
import { ComponentType } from "react"
import { BehaviorSubject, tap } from "rxjs"

export const modal$ = new BehaviorSubject<
  Nullable<{ Component: ComponentType; showCloseButton: boolean; onHide: ThunkFn<void> }>
>(null)

export const _initModals = callOnce((logger: Logger) => {
  modal$
    .pipe(tap((state) => (state ? logger.debug("Modal shown") : logger.debug("Modal hidden"))))
    .subscribe()

  return modal$
})

type ShowModalParams = {
  showCloseButton?: boolean
  onHide?: ThunkFn<void>
}

export const showModal = (Component: ComponentType, params?: ShowModalParams) => {
  modal$.next({
    showCloseButton: params?.showCloseButton ?? true,
    onHide: params?.onHide ?? (() => void 0),
    Component,
  })
}

export const hideModal = () => {
  modal$.next(null)
}
