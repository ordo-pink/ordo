import "@ordo-pink/css/main.css"
import "./index.css"

import { createRoot } from "react-dom/client"

import { __initActivities, currentFID$ } from "@ordo-pink/frontend-stream-activities"
import { ConsoleLogger } from "@ordo-pink/logger"
import { __initAuth$ } from "@ordo-pink/frontend-stream-user"
import { __initCommandPalette } from "@ordo-pink/frontend-stream-command-palette"
import { __initCommands } from "@ordo-pink/frontend-stream-commands"
import { __initFetch } from "@ordo-pink/frontend-fetch"
import { __initLogger } from "@ordo-pink/frontend-logger"
import { __initRouter } from "@ordo-pink/frontend-stream-router"
import { __initSidebar } from "@ordo-pink/frontend-stream-sidebar"
import { __initUser$ } from "@ordo-pink/frontend-stream-user"

import { APP_FID, idHost, isDev, webHost } from "./constants"

import App from "./app"

currentFID$.next(APP_FID)

__initFetch()
__initLogger(ConsoleLogger)
__initCommands({ fid: APP_FID })
__initRouter(APP_FID)
__initAuth$({ fid: APP_FID, idHost, webHost, isDev })
__initUser$({ fid: APP_FID, idHost })
__initCommandPalette(APP_FID)
__initActivities(APP_FID)
__initSidebar(APP_FID)

const container = document.getElementById("root")!
const root = createRoot(container)

root.render(<App />)
