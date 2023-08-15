import { BehaviorSubject, Observable } from "rxjs"
import type { ComponentType } from "react"
import { Nullable, Thunk, callOnce } from "#lib/tau/mod"
import { Logger } from "#lib/logger/mod"

// --- Public ---

/**
 * Options for showing the modal.
 */
export type ShowModalOptions = {
	/**
	 * Show close button.
	 *
	 * @optional
	 * @default true
	 */
	showCloseButton?: boolean

	/**
	 * Function to run before the modal is hidden.
	 *
	 * @optional
	 * @default () => void 0
	 */
	onHide?: Thunk<void>
}

/**
 * Entrypoint for using modal.
 */
export const getModal = () => ({
	/**
	 * Show modal.
	 *
	 * @param ComponentType React component to be shown in the body of the modal.
	 * @param ShowModalOptions Modal options.
	 */
	show,

	/**
	 * Hide modal.
	 */
	hide,
})

// --- Internal ---

export type __Modal$ = Observable<Nullable<Modal>>
export const __initModal = callOnce(({ logger }: InitModalP) => {
	logger.debug("Initializing modal")
	return modal$
})

type InitModalP = { logger: Logger }
type Modal = { Component: ComponentType; showCloseButton: boolean; onHide: Thunk<void> }
type Show = (x: ComponentType, y?: ShowModalOptions) => void

const modal$ = new BehaviorSubject<Nullable<Modal>>(null)

const show: Show = (Component, params = { showCloseButton: true, onHide: () => void 0 }) =>
	modal$.next({
		showCloseButton: params.showCloseButton ?? true,
		onHide: params.onHide ?? (() => void 0),
		Component,
	})

const hide = () => modal$.next(null)
