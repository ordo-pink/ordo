import { Nullable, UnaryFn } from "@ordo-pink/common-types"
import { callOnce } from "@ordo-pink/fns"
import { ComponentType } from "react"
import { BehaviorSubject } from "rxjs"

export const modal$ = new BehaviorSubject<Nullable<ComponentType>>(null)

export const _initModals = callOnce(() => {
  modal$.subscribe()

  return modal$
})

export const showModal: UnaryFn<ComponentType, void> = (Component) => {
  modal$.next(Component)
}

export const hideModal = () => {
  modal$.next(null)
}
