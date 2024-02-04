import "@ordo-pink/css/main.css"
import "./index.css"

import { ErrorInfo, StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { ConsoleLogger } from "@ordo-pink/logger"
import { __initCommands } from "@ordo-pink/frontend-stream-commands"

import ErrorBoundary from "@ordo-pink/frontend-react-components/error-boundary"

import App from "./app"

__initCommands({ logger: ConsoleLogger })

const logError = (error: Error, info: ErrorInfo) => {
	ConsoleLogger.error(error)
	ConsoleLogger.error(info.componentStack)
}

const Fallback = () => <div>TODO</div>

const container = document.getElementById("root")!

createRoot(container).render(
	<StrictMode>
		<ErrorBoundary logError={logError} fallback={<Fallback />}>
			<App />
		</ErrorBoundary>
	</StrictMode>,
)
