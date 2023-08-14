import { useEffect } from "react"
import { Hosts, initHosts, refreshAuthInfo, onBeforeQuit } from "../streams/auth"
import { initCommands } from "../streams/commands"
import { ConsoleLogger } from "#lib/logger/mod"
import { initSidebar } from "../streams/sidebar"
import { initModals } from "../streams/modal"
import { initCommandPalette } from "../streams/command-palette"
import { initRouter } from "../streams/router"
import { initContextMenu } from "../streams/context-menu"
import { initActivities, initExtensions } from "../streams/extensions"

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

export const useAppInit = (hosts: Hosts) => {
	useEffect(() => {
		initHosts(hosts)
		initCommands({ logger: ConsoleLogger })
		const router$ = initRouter({ logger: ConsoleLogger })
		initModals({ logger: ConsoleLogger })
		initContextMenu()
		initCommandPalette()
		initSidebar()
		initExtensions({ logger: ConsoleLogger, router$, extensions: [] })
		initActivities()

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
}
