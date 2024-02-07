import "@ordo-pink/css/main.css"
import "./index.css"

import { createRoot } from "react-dom/client"

import { __initActivities, currentFID$ } from "@ordo-pink/frontend-stream-activities"
import { ConsoleLogger } from "@ordo-pink/logger"
import { __initAuth$ } from "@ordo-pink/frontend-stream-user"
import { __initCommands } from "@ordo-pink/frontend-stream-commands"
import { __initFetch } from "@ordo-pink/frontend-fetch"
import { __initLogger } from "@ordo-pink/frontend-logger"
import { __initRouter } from "@ordo-pink/frontend-stream-router"
import { __initSidebar } from "@ordo-pink/frontend-stream-sidebar"
import { __initUser$ } from "@ordo-pink/frontend-stream-user"

import { APP_FID } from "./fid"

import App from "./app"

const idHost = import.meta.env.VITE_ORDO_ID_HOST
const webHost = import.meta.env.VITE_ORDO_WEBSITE_HOST
const isDev = import.meta.env.DEV

currentFID$.next(APP_FID)

__initFetch()
__initLogger(ConsoleLogger)
__initCommands(APP_FID)
__initRouter(APP_FID)
__initAuth$({ fid: APP_FID, idHost, webHost, isDev })
__initUser$({ fid: APP_FID, idHost })
__initActivities(APP_FID)
__initSidebar(APP_FID)

const container = document.getElementById("root")!
const root = createRoot(container)

root.render(<App />)
