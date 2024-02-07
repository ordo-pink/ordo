import "@ordo-pink/css/main.css"
import "./index.css"

import { ErrorInfo, createContext } from "react"
import { createRoot } from "react-dom/client"

import { SharedContextValue, __initUseSharedContext } from "@ordo-pink/frontend-react-hooks"
import { ConsoleLogger } from "@ordo-pink/logger"
import { KnownFunctions } from "@ordo-pink/known-functions"
import { ORDO_PINK_APP_FUNCTION } from "@ordo-pink/core"
import { __initAuth$ } from "@ordo-pink/frontend-stream-user"
import { __initCommands } from "@ordo-pink/frontend-stream-commands"
import { __initFetch } from "@ordo-pink/frontend-fetch"
import { __initLogger } from "@ordo-pink/frontend-logger"
import { __initUser$ } from "@ordo-pink/frontend-stream-user/src/frontend-stream-user.impl"
import { currentFID$ } from "@ordo-pink/frontend-stream-activities"

import ErrorBoundary from "@ordo-pink/frontend-react-components/error-boundary"

import App from "./app"

const idHost = import.meta.env.VITE_ORDO_ID_HOST
const webHost = import.meta.env.VITE_ORDO_WEBSITE_HOST
const isDev = import.meta.env.DEV

const fid = KnownFunctions.register(ORDO_PINK_APP_FUNCTION, { commands: [], queries: [] })!

currentFID$.next(fid)

const SharedContext = createContext<SharedContextValue>({
	data: null,
	route: null,
	fid,
	workspaceSplitSize: [0, 100],
})

__initFetch()
__initLogger(ConsoleLogger)
__initUseSharedContext(SharedContext)
__initCommands(fid)
__initAuth$({ fid, idHost, webHost, isDev })
__initUser$({ fid, idHost })

const logError = (error: Error, info: ErrorInfo) => {
	ConsoleLogger.error(error)
	ConsoleLogger.error(info.componentStack)
}

const Fallback = () => <div>TODO</div> // TODO: Add error fallback

const container = document.getElementById("root")!
const root = createRoot(container)

const AppWrapper = () => {
	return (
		<ErrorBoundary logError={logError} fallback={<Fallback />}>
			<SharedContext.Provider
				value={{ data: null, route: null, fid, workspaceSplitSize: [0, 100] }}
			>
				<App />
			</SharedContext.Provider>
		</ErrorBoundary>
	)
}

root.render(<AppWrapper />)
