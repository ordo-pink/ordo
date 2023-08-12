import { BehaviorSubject } from "rxjs"
import { callOnce } from "#lib/tau/mod"
import { registerCommand } from "./commands"
import { useSubscription } from "../hooks/use-subscription"

type State =
	| {
			disabled: false
			sizes: [number, number]
	  }
	| { disabled: true }

const sidebar$ = new BehaviorSubject<State>({ disabled: false, sizes: [25, 75] })

export const initSidebar = callOnce(() => {
	registerCommand("sidebar.disable", () => {
		const sidebar = sidebar$.value
		if (sidebar.disabled) return
		sidebar$.next({ disabled: true })
	})

	registerCommand("sidebar.enable", () => {
		const sidebar = sidebar$.value
		if (!sidebar.disabled) return
		sidebar$.next({ disabled: false, sizes: [25, 75] })
	})

	registerCommand("sidebar.set-size", ({ payload }) => {
		const sidebar = sidebar$.value
		if (sidebar.disabled) return
		sidebar$.next({ disabled: false, sizes: payload })
	})

	registerCommand("sidebar.show", ({ payload = [25, 75] }) => {
		const sidebar = sidebar$.value
		if (sidebar.disabled) return
		sidebar$.next({ disabled: false, sizes: payload })
	})

	registerCommand("sidebar.hide", () => {
		const sidebar = sidebar$.value
		if (sidebar.disabled) return
		sidebar$.next({ disabled: false, sizes: [0, 100] })
	})
})

export const useSidebar = () => useSubscription(sidebar$, { disabled: false, sizes: [25, 75] })
