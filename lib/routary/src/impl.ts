// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type {
	HttpMethod,
	Route,
	TRouter,
	Context,
	Middleware,
	RouteMap,
	RouterBeforeSendMiddleware,
} from "./types"
import { Oath } from "@ordo-pink/oath"

const isMethod = (method: HttpMethod, request: Request) => request.method === method
const isRoute = (route: Route, request: Request) =>
	route instanceof RegExp ? route.test(request.url) : new URL(request.url).pathname === route

const store = ((state: Record<string, any> = {}) => ({
	get: (key: string) => state[key],
	set: (key: string, value: any) => void (state[key] = value),
	del: (key: string) => void (state[key] = null),
}))()

// TODO: Fix any types
const router = (
	handleError: (error: unknown) => any = () => void 0,
	ctx: Context = { isMethod, isRoute, store } as any,
	middleware: Middleware[] = [],
	routes: RouteMap = [],
): TRouter => ({
	delete: (route, handle) =>
		router(handleError, ctx, middleware, routes).each(["DELETE"], route, handle),
	get: (route, handle) => router(handleError, ctx, middleware, routes).each(["GET"], route, handle),
	head: (route, handle) =>
		router(handleError, ctx, middleware, routes).each(["HEAD"], route, handle),
	options: (route, handle) =>
		router(handleError, ctx, middleware, routes).each(["OPTIONS"], route, handle),
	patch: (route, handle) =>
		router(handleError, ctx, middleware, routes).each(["PATCH"], route, handle),
	post: (route, handle) =>
		router(handleError, ctx, middleware, routes).each(["POST"], route, handle),
	put: (route, handle) => router(handleError, ctx, middleware, routes).each(["PUT"], route, handle),
	onError: handleError => router(handleError, ctx, middleware, routes),
	each: (methods, route, handle) =>
		router(
			handleError,
			ctx,
			middleware,
			routes.concat(methods.map(m => [m, route, handle])),
		) as any,
	orElse: handle => req =>
		Oath.fromNullable(routes.find(([m, r]) => ctx.isMethod(m, req) && ctx.isRoute(r, req)))
			.fix(() => [req.method, req.url, handle] as const)
			.chain(([_, route, handle]) => {
				const sequence = middleware.concat(handle)

				return sequence.length > 1
					? sequence.reduce(
							(acc, handler) =>
								acc.chain(r => Oath.try(async () => await handler(req, { ...ctx, route, routes }))),
							Oath.empty(),
					  )
					: Oath.try(async () => await sequence[0](req, { ...ctx, route, routes }))
			})
			.orElse(handleError),
})

export const Router = {
	create: () => router() as TRouter,
}
