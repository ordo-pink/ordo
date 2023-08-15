import { BehaviorSubject, Observable } from "rxjs"
import type { ComponentType } from "react"
import { Nullable, Thunk, callOnce } from "#lib/tau/mod"
import { Logger } from "#lib/logger/mod"
import { getCommands } from "$streams/commands"
import { cmd, Modal as TModal } from "#lib/libfe/mod"

const commands = getCommands()

export type __Modal$ = Observable<Nullable<Modal>>
export const __initModal = callOnce(({ logger }: InitModalP) => {
	logger.debug("Initializing modal")

	commands.on<cmd.modal.hide>("modal.hide", hide)
	commands.on("modal.show", ({ payload }) => show(payload.Component, payload.options))

	return modal$
})

type InitModalP = { logger: Logger }
type Modal = { Component: ComponentType; showCloseButton: boolean; onHide: Thunk<void> }
type Show = (x: ComponentType, y?: TModal.ShowOptions) => void

const modal$ = new BehaviorSubject<Nullable<Modal>>(null)

const show: Show = (Component, params = { showCloseButton: true, onHide: () => void 0 }) =>
	modal$.next({
		showCloseButton: params.showCloseButton ?? true,
		onHide: params.onHide ?? (() => void 0),
		Component,
	})

const hide = () => modal$.next(null)
