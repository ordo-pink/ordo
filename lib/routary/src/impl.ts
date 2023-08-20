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
	beforeSendMiddleware: RouterBeforeSendMiddleware[] = [] // TODO: Fix type
): TRouter => ({
	use: mw => router(handleError, ctx, middleware.concat([mw]), routes, beforeSendMiddleware),
	delete: (route, handle) =>
		router(handleError, ctx, middleware, routes, beforeSendMiddleware).each(
			["DELETE"],
			route,
			handle
		),
	get: (route, handle) =>
		router(handleError, ctx, middleware, routes, beforeSendMiddleware).each(["GET"], route, handle),
	head: (route, handle) =>
		router(handleError, ctx, middleware, routes, beforeSendMiddleware).each(
			["HEAD"],
			route,
			handle
		),
	options: (route, handle) =>
		router(handleError, ctx, middleware, routes, beforeSendMiddleware).each(
			["OPTIONS"],
			route,
			handle
		),
	patch: (route, handle) =>
		router(handleError, ctx, middleware, routes, beforeSendMiddleware).each(
			["PATCH"],
			route,
			handle
		),
	post: (route, handle) =>
		router(handleError, ctx, middleware, routes, beforeSendMiddleware).each(
			["POST"],
			route,
			handle
		),
	put: (route, handle) =>
		router(handleError, ctx, middleware, routes, beforeSendMiddleware).each(["PUT"], route, handle),
	onError: handleError => router(handleError, ctx, middleware, routes, beforeSendMiddleware),
	beforeSent: beforeSent =>
		router(handleError, ctx, middleware, routes, [...beforeSendMiddleware, beforeSent]),
	each: (methods, route, handle) =>
		router(
			handleError,
			ctx,
			middleware,
			routes.concat(methods.map(m => [m, route, handle])),
			beforeSendMiddleware
		) as any,
	orElse: handle => req =>
		Oath.fromNullable(routes.find(([m, r]) => ctx.isMethod(m, req) && ctx.isRoute(r, req)))
			.fix(() => [req.method, req.url, handle] as const)
			.chain(([_, route, handle]) => {
				const sequence = middleware.concat(handle)

				const oath =
					sequence.length > 1
						? sequence.reduce(
								(acc, handler) =>
									acc.chain(r =>
										Oath.try(async () => await handler(req, { ...ctx, route, routes }))
									),
								Oath.empty()
						  )
						: Oath.try(async () => await sequence[0](req, { ...ctx, route, routes }))

				return beforeSendMiddleware.length > 0
					? beforeSendMiddleware.reduce(
							(acc, mw) =>
								acc.chain(res =>
									Oath.try(async () => {
										await mw(req, res, ctx)
										return res
									})
								),
							oath
					  )
					: oath
			})
			.orElse(handleError),
})

export const Router = {
	create: () => router() as TRouter,
}
