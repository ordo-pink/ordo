import { useEffect } from "react"
import { Hosts, initHosts, refreshAuthInfo, signOut } from "../streams/auth"
import { initCommands } from "../streams/commands"
import { ConsoleLogger } from "#lib/logger/mod"
import { initSidebar } from "../streams/sidebar"
import { initModals } from "../streams/modal"
import { initCommandPalette } from "../streams/command-palette"

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
		initModals(ConsoleLogger)
		initCommandPalette()
		initSidebar()
		// initActivities()

		// initExtensions({ logger: ConsoleLogger, router$, contextMenu$, extensions: [] })

		refreshToken(hosts)
		const interval = setInterval(() => refreshToken(hosts), 50000)

		return () => {
			clearInterval(interval)
			signOut()
		}
	}, [])
}
