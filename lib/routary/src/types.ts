// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Oath } from "@ordo-pink/oath"
import { RoutaryResponse } from "./impl"

export type RequiredRouterState = {
	checkRoute: CheckRouteFn
	checkMethod: CheckMethodFn
}

export type Gear<RouterState extends RequiredRouterState = RequiredRouterState> = (
	ctx: Context<RouterState>,
) => Oath<any, any>

export type CheckMethodFn = (method: HttpMethod, req: Request) => boolean

export type CheckRouteFn = (route: Route, req: Request) => boolean

export type Context<
	RouterState extends RequiredRouterState = RequiredRouterState,
	ResponseBody = any,
> = {
	route: Route
	req: Request
	res: RoutaryResponse<ResponseBody>
	state: RouterState
}

export type RouteMap<T extends RequiredRouterState = RequiredRouterState> = [
	HttpMethod,
	Route,
	Gear<T>,
][]

export type Route = string | RegExp

export type HttpMethod = "GET" | "PUT" | "HEAD" | "POST" | "PATCH" | "DELETE" | "OPTIONS"

export type RouterEachHandler<T extends RequiredRouterState = RequiredRouterState> = (
	methods: HttpMethod[],
	route: Route,
	gear: Gear<T>,
) => TRouter
export type RouterOrElseHandler<RouterState extends RequiredRouterState = RequiredRouterState> = (
	gear: (ctx: Context<RouterState>) => any,
) => (request: Request) => any

export type TRouter<T extends RequiredRouterState = RequiredRouterState> = {
	get: (route: Route, gear: Gear<T>) => TRouter<T>
	put: (route: Route, gear: Gear<T>) => TRouter<T>
	head: (route: Route, gear: Gear<T>) => TRouter<T>
	post: (route: Route, gear: Gear<T>) => TRouter<T>
	patch: (route: Route, gear: Gear<T>) => TRouter<T>
	delete: (route: Route, gear: Gear<T>) => TRouter<T>
	options: (route: Route, gear: Gear<T>) => TRouter<T>
	each: RouterEachHandler<T>
	orElse: RouterOrElseHandler<T>
}
