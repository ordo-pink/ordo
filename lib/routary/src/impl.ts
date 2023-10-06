// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { HttpMethod, Route, TRouter, Context, RequiredRouterState, RouteMap } from "./types"
import { Oath } from "@ordo-pink/oath"

const checkMethod = (method: HttpMethod, request: Request) => request.method === method
const checkRoute = (route: Route, request: Request) =>
	route instanceof RegExp ? route.test(request.url) : new URL(request.url).pathname === route

const createNativeResponse = (ctx: Context) =>
	new Response(ctx.res.body, { headers: ctx.res.headers, status: ctx.res.status })

const router = <T extends RequiredRouterState = RequiredRouterState>(
	routes: RouteMap,
	ctx: Context<T>,
): TRouter<T> => ({
	delete: (route, handle) => router(routes, ctx).each(["DELETE"], route, handle) as any,
	get: (route, handle) => router(routes, ctx).each(["GET"], route, handle) as any,
	head: (route, handle) => router(routes, ctx).each(["HEAD"], route, handle) as any,
	options: (route, handle) => router(routes, ctx).each(["OPTIONS"], route, handle) as any,
	patch: (route, handle) => router(routes, ctx).each(["PATCH"], route, handle) as any,
	post: (route, handle) => router(routes, ctx).each(["POST"], route, handle) as any,
	put: (route, handle) => router(routes, ctx).each(["PUT"], route, handle) as any,
	each: (methods, route, handle) =>
		router(routes.concat(methods.map(m => [m, route, handle]) as any), {
			...ctx,
			state: {
				...ctx.state,
			},
		}),
	orElse: onError => req =>
		Oath.fromNullable(
			routes.find(([m, r]) => ctx.state.checkMethod(m, req) && ctx.state.checkRoute(r, req)),
		)
			.chain(([_, route, gear]) =>
				Oath.of({ ...ctx, req, route, res: RoutaryResponse.empty() }).chain(ctx =>
					gear(ctx)
						.fix(onError)
						.map(() => ctx),
				),
			)
			.fork(() => void 0, createNativeResponse),
})

export type CreateRouterOptions<T extends RequiredRouterState = RequiredRouterState> = {
	state: T
}

export const Router = {
	create: <T extends RequiredRouterState = RequiredRouterState>(
		options: CreateRouterOptions<T> = {} as any,
	) =>
		router([], {
			state: options.state ?? { checkMethod, checkRoute },
		} as any),
}

export class RoutaryResponse<T = any> {
	public static empty() {
		return new RoutaryResponse(404, {}, null)
	}

	#status: number
	#headers: Record<string, string>
	#body: T

	protected constructor(status: number, headers: Record<string, string>, body: T) {
		this.#status = status
		this.#headers = headers
		this.#body = body
	}

	public setHeader(key: string, value: string) {
		this.#headers[key] = value
	}

	public setBody(body: T) {
		this.#body = body
	}

	public setStatus(status: number) {
		this.#status = status
	}

	public get status() {
		return this.#status
	}

	public get headers() {
		return this.#headers
	}

	public get body() {
		return this.#body
	}
}
