import { UnaryFn } from "./types"

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

export type NavigateFn = UnaryFn<RouterSetParams, void>

export type OpenExternalFn = UnaryFn<{ url: string; newTab?: boolean }, void>
