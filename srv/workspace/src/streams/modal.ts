import { Logger } from "#lib/logger/mod"
import { Nullable, Thunk, callOnce } from "#lib/tau/mod"
import { ComponentType } from "react"
import { BehaviorSubject, tap } from "rxjs"

export const modal$ = new BehaviorSubject<
	Nullable<{ Component: ComponentType; showCloseButton: boolean; onHide: Thunk<void> }>
>(null)

type Params = { logger: Logger }
export const initModals = callOnce(({ logger }: Params) => {
	modal$
		.pipe(tap(state => (state ? logger.debug("Modal shown") : logger.debug("Modal hidden"))))
		.subscribe()

	return modal$
})

type ShowModalParams = {
	showCloseButton?: boolean
	onHide?: Thunk<void>
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
