/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { Oath, ops0 } from "@ordo-pink/oath"

import type { Context, HttpMethod, RequiredRouterState, Route, RouteMap, TRouter } from "./types"

const check_method = (method: HttpMethod, request: Request) => request.method === method
const check_route = (route: Route, request: Request) =>
	route instanceof RegExp ? route.test(new URL(request.url).pathname) : new URL(request.url).pathname === route

const create_native_response = (ctx: Context) =>
	new Response(ctx.res.body, { headers: ctx.res.headers, status: ctx.res.status })

const router = <T extends RequiredRouterState = RequiredRouterState>(routes: RouteMap, ctx: Context<T>): TRouter<T> => ({
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
	or_else: on_error => req =>
		Oath.FromNullable(routes.find(([m, r]) => ctx.state.check_method(m, req) && ctx.state.check_route(r, req)))
			.pipe(
				ops0.chain(([, route, gear]) =>
					Oath.Resolve({ ...ctx, req, route, res: RoutaryResponse.empty() }).pipe(
						ops0.chain(ctx =>
							gear(ctx)
								.fix(on_error)
								.pipe(ops0.map(() => ctx)),
						),
					),
				),
			)
			.fix(() => {
				const context = { ...ctx, res: RoutaryResponse.empty() }
				on_error(context)

				return context
			})
			.fork(() => void 0, create_native_response as any),
})

export type CreateRouterOptions<T extends RequiredRouterState = RequiredRouterState> = {
	state: T
}

export const Router = {
	create: <T extends RequiredRouterState = RequiredRouterState>(options: CreateRouterOptions<T> = {} as any) =>
		router([], {
			state: options.state ?? { check_method: check_method, check_route: check_route },
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
