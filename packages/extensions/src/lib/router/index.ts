import { Router, operators } from "silkrouter"
import { executeCommand, registerCommand } from "../commands"
export const { route, noMatch } = operators

// Types ------------------------------------------------------------------- //

type RouteConfigOption = {
  route: string
  queryString?: string | object
  pageTitle?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any
  preserveQuery?: boolean
  replace?: boolean
  exec?: boolean
}

export type RouterSetParams = [
  routeConfig: string | RouteConfigOption,
  replace?: boolean,
  exec?: boolean,
]

export type NavigateCommand = ["router.navigate", RouterSetParams]
export type OpenExternalCommand = ["router.open-external", { url: string; newTab?: boolean }]

// Router ------------------------------------------------------------------ //

export const router$ = new Router({
  hashRouting: false,
  init: true,
})

// Internal Initialisation ------------------------------------------------- //

registerCommand<NavigateCommand>("router.navigate", (params) => router$.set(...params))
registerCommand<OpenExternalCommand>("router.open-external", ({ url, newTab = true }) =>
  newTab ? window.open(url, "_blank")?.focus() : (window.location.href = url),
)

// API --------------------------------------------------------------------- //

export const openExternal = (url: string) => {
  executeCommand("router.open-external", { url })
}

export const navigate = (...params: RouterSetParams) => {
  executeCommand("router.navigate", params)
}
