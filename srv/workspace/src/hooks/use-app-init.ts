import { useEffect, useState } from "react"
import { ConsoleLogger } from "#lib/logger/mod"
import { Nullable } from "#lib/tau/mod"
import { Hosts, initHosts, refreshAuthInfo, onBeforeQuit } from "$streams/auth"
import { __ContextMenu$, __initContextMenu } from "$streams/context-menu"
import { initActivities, initExtensions } from "$streams/extensions"
import { initCommandPalette } from "$streams/command-palette"
import { __initCommands } from "$streams/commands"
import { initSidebar } from "$streams/sidebar"
import { initRouter } from "$streams/router"
import { initModals } from "$streams/modal"

const refreshToken = (hosts: Hosts) => {
	fetch(`${hosts.id}/refresh-token`, { method: "POST", credentials: "include" })
		.then(res => res.json())
		.then(res => {
			if (res.accessToken) {
				return refreshAuthInfo(res)
			}

			window.location.href = `${hosts.web}`
		})
}

export type UseAppInitReturns = {
	contextMenu$: Nullable<__ContextMenu$>
}

export const useAppInit = (hosts: Hosts): UseAppInitReturns => {
	const [contextMenu$, setContextMenu$] = useState<Nullable<__ContextMenu$>>(null)

	useEffect(() => {
		initHosts(hosts)
		__initCommands({ logger: ConsoleLogger })
		const router$ = initRouter({ logger: ConsoleLogger })
		initModals({ logger: ConsoleLogger })
		initCommandPalette()
		initSidebar()
		initExtensions({ logger: ConsoleLogger, router$, extensions: [] })
		initActivities()

		const contextMenu$ = __initContextMenu({ logger: ConsoleLogger })

		setContextMenu$(contextMenu$)

		// TODO: Allow native context menu if custom context menu is not available
		const suppressRightClickBehavior = (event: MouseEvent) => event.preventDefault()
		document.addEventListener("contextmenu", suppressRightClickBehavior)

		refreshToken(hosts)
		const interval = setInterval(() => refreshToken(hosts), 50000)

		return () => {
			document.removeEventListener("contextmenu", suppressRightClickBehavior)
			onBeforeQuit()
			clearInterval(interval)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return { contextMenu$ }
}
