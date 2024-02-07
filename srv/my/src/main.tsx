import "@ordo-pink/css/main.css"
import "./index.css"

import { createRoot } from "react-dom/client"

import { __initActivities, currentFID$ } from "@ordo-pink/frontend-stream-activities"
import { ConsoleLogger } from "@ordo-pink/logger"
import { __initAuth$ } from "@ordo-pink/frontend-stream-user"
import { __initCommandPalette } from "@ordo-pink/frontend-stream-command-palette"
import { __initCommands } from "@ordo-pink/frontend-stream-commands"
import { __initFetch } from "@ordo-pink/frontend-fetch"
import { __initHosts } from "@ordo-pink/frontend-react-hooks"
import { __initLogger } from "@ordo-pink/frontend-logger"
import { __initRouter } from "@ordo-pink/frontend-stream-router"
import { __initSidebar } from "@ordo-pink/frontend-stream-sidebar"
import { __initUser$ } from "@ordo-pink/frontend-stream-user"

export const idHost = import.meta.env.VITE_ORDO_ID_HOST
export const websiteHost = import.meta.env.VITE_ORDO_WEBSITE_HOST
export const staticHost = import.meta.env.VITE_ORDO_STATIC_HOST
export const dtHost = import.meta.env.VITE_ORDO_DT_HOST
export const myHost = import.meta.env.VITE_ORDO_WORKSPACE_HOST

import { APP_FID, isDev } from "./app-fid"

import App from "./app"

currentFID$.next(APP_FID)

__initHosts({ idHost, websiteHost, staticHost, dtHost, myHost })
__initFetch()
__initLogger(ConsoleLogger)
__initCommands({ fid: APP_FID })
__initRouter(APP_FID)
__initAuth$({ fid: APP_FID, isDev })
__initUser$({ fid: APP_FID, idHost })
__initCommandPalette(APP_FID)
__initActivities(APP_FID)
__initSidebar(APP_FID)

const container = document.getElementById("root")!
const root = createRoot(container)

root.render(<App />)
