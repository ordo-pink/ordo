import { Logger } from "#lib/logger/mod"
import { Unary, callOnce } from "#lib/tau/mod"
import { useCommands } from "src/hooks/use-commands"
import { Router, operators } from "silkrouter"

/**
 * Route descriptor to be passed for navigating.
 */
export type RouteConfig = {
	route: string
	queryString?: string | Record<string, string>
	pageTitle?: string
	data?: Record<string, unknown>
	preserveQuery?: boolean
	replace?: boolean
	exec?: boolean
}

export type RouterSetParams = [routeConfig: string | RouteConfig, replace?: boolean, exec?: boolean]

export type Route<Params extends Record<string, string> = Record<string, string>, Data = null> = {
	params: Params
	data: Data
	hash: string
	hashRouting: boolean
	search: string
	path: string
	route: string
}

export type NavigateFn = Unary<RouterSetParams, void>

export type OpenExternalFn = Unary<{ url: string; newTab?: boolean }, void>

// Internal -------------------------------------------------------------------

const router$ = new Router({
	hashRouting: false,
	init: true,
})

export const { route, noMatch } = operators

// API ------------------------------------------------------------------------

export const navigate: NavigateFn = params => router$.set(...params)

export const openExternal: OpenExternalFn = ({ url, newTab = true }) => {
	newTab ? window.open(url, "_blank")?.focus() : (window.location.href = url)
}

type Params = { logger: Logger }
export const initRouter = callOnce(({ logger }: Params) => {
	const commands = useCommands()

	commands.on("router.navigate", ({ payload }) => {
		logger.debug("Navigating to", payload)

		if (Array.isArray(payload)) {
			router$.set(...(payload as [string]))
			return
		}

		router$.set(payload.url)
	})

	commands.on("router.open-external", ({ payload: { url, newTab = true } }) => {
		logger.debug("Opening external page", { url, newTab })
		newTab ? window.open(url, "_blank")?.focus() : (window.location.href = url)
	})

	return router$
})
