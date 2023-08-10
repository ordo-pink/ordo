import { useEffect } from "preact/hooks"
import { Hosts, initHosts, refreshAuthInfo, signOut } from "../streams/auth.ts"
import { initCommands } from "../streams/commands.ts"
import { ConsoleLogger } from "#lib/logger/mod.ts"
import { initRouter } from "../streams/router.ts"
import { initSidebar } from "../streams/sidebar.ts"

const refreshToken = (host: string) => {
	fetch(`${host}/refresh-token`, { method: "POST", credentials: "include" })
		.then(res => res.json())
		.then(refreshAuthInfo)
}

export const useAppInit = ({ idHost, dataHost }: Hosts) => {
	useEffect(() => {
		initHosts({ idHost, dataHost })
		initCommands({ logger: ConsoleLogger })
		initRouter()
		initSidebar()
		refreshToken(idHost)

		const interval = setInterval(() => refreshToken(idHost), 50000)

		return () => {
			clearInterval(interval)
			signOut()
		}
	}, [])
}
