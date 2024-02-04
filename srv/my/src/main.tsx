import React from "react"
import ReactDOM from "react-dom/client"
import App from "./app.tsx"
import "./index.css"
import { __initCommands } from "@ordo-pink/frontend-stream-commands/index.ts"
import { ConsoleLogger } from "@ordo-pink/logger/index.ts"

__initCommands({ logger: ConsoleLogger })

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
)
