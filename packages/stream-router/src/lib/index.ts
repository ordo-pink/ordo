import { NavigateFn, OpenExternalFn, RouterSetParams } from "@ordo-pink/common-types"
import { callOnce } from "@ordo-pink/fns"
import { registerCommand } from "@ordo-pink/stream-commands"
import { Router, operators } from "silkrouter"

// Internal -------------------------------------------------------------------

const router$ = new Router({
  hashRouting: false,
  init: true,
})

export const { route, noMatch } = operators

// API ------------------------------------------------------------------------

export const navigate: NavigateFn = (params) => router$.set(...params)

export const openExternal: OpenExternalFn = ({ url, newTab = true }) => {
  newTab ? window.open(url, "_blank")?.focus() : (window.location.href = url)
}

export const _initRouter = callOnce(() => {
  registerCommand("router.navigate", (params: RouterSetParams) => {
    router$.set(...params)
  })

  registerCommand(
    "router.open-external",
    ({ url, newTab = true }: { url: string; newTab?: boolean }) => {
      newTab ? window.open(url, "_blank")?.focus() : (window.location.href = url)
    },
  )

  return router$
})
