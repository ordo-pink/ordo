import { BehaviorSubject } from "#x/rxjs@v1.0.2/mod.ts"
import { callOnce } from "#lib/tau/mod.ts"
import { registerCommand } from "./commands.ts"
import { useSubscription } from "../hooks/use-subscription.ts"

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

export const useSidebar = () => useSubscription(sidebar$)
