// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

export type Middleware<Ctx = Context, Result = any> = (request: Request, ctx: Ctx) => Result

export type Context<S extends Record<string, unknown> = Record<string, unknown>> = {
	routes: RouteMap
	route: Route
	isMethod: (method: HttpMethod, req: Request) => boolean
	isRoute: (route: Route, req: Request) => boolean
	store: {
		set: <K extends keyof S>(key: K, value: S[K]) => void
		get: <K extends keyof S>(key: K) => S[K]
		del: <K extends keyof S>(key: K) => void
	}
}

export type RouteMap = [HttpMethod, Route, Handle][]

export type Handler<T extends Record<string, unknown> = Record<string, unknown>> = (
	request: Request,
	ctx: Context<T>,
) => Promise<Response> | Response // TODO: Support for returned Oaths

export type Route = string | RegExp

export type Handle = Handler | [...Middleware[], Handler] // TODO: Support Oaths directly as well

export type RouteHandler = (route: Route, handle: Handle) => TRouter

export type HttpMethod = "GET" | "PUT" | "HEAD" | "POST" | "PATCH" | "DELETE" | "OPTIONS"

export type RouterEachHandler = (methods: HttpMethod[], route: Route, handle: Handle) => TRouter

export type RouterOrElseHandler = (
	handleUnmatched: Handle,
) => (request: Request) => Promise<Response>

export type RouterErrorHandler = (handleError: (error: unknown) => any) => TRouter

export type RouterUseHandler = (middleware: Middleware) => TRouter

export type RouterBeforeSendMiddleware<
	S extends Record<string, unknown> = Record<string, unknown>,
> = (
	request: Request,
	response: Response,
	ctx: Context<S>,
) => Response | Promise<Response> | void | Promise<void>

export type RouterHandleBeforeSend = (handleBeforeSent: RouterBeforeSendMiddleware) => TRouter // TODO: Support for returned Oaths

export type TRouter = {
	get: RouteHandler
	put: RouteHandler
	head: RouteHandler
	post: RouteHandler
	patch: RouteHandler
	delete: RouteHandler
	options: RouteHandler
	each: RouterEachHandler
	orElse: RouterOrElseHandler
	onError: RouterErrorHandler
}

// export type Intake = Request
// export type Exhaust = Response

// export type AlignmentBushing = (
// 	methods: HttpMethod[],
// 	spark: Spark,
// 	combustion: Combustion
// ) => TRoutary

// export type Gear<Cst = Crankshaft, Ignite = any> = (intake: Intake, shaft: Cst) => Ignite

// export type Crankshaft<C extends Record<string, unknown> = Record<string, unknown>> = C & {
// 	routes: Engine
// 	route: Spark
// }

// export type Engine = [HttpMethod, Spark, Combustion][]

// export type Rotor<T extends Record<string, unknown> = Record<string, unknown>> = (
// 	intake: Intake,
// 	shaft: Crankshaft<T>
// ) => Promise<Exhaust> | Exhaust

// export type Combustion = Rotor | [...Gear[], Rotor]

// export type Spark = string | RegExp

// export type Housing = (spark: Spark, combustion: Combustion) => TRoutary

// export type TRoutary = {
// 	use: (gear: Gear) => TRoutary
// 	get: Housing
// 	put: Housing
// 	each: AlignmentBushing
// 	head: Housing
// 	post: Housing
// 	patch: Housing
// 	delete: Housing
// 	orElse: (combustion: Combustion) => (intake: Intake) => any
// 	options: Housing
// 	onError: (handleError: (error: unknown) => any) => TRoutary
// 	beforeSent: (
// 		handleBeforeSent: (
// 			intake: Intake,
// 			exhaust: Exhaust,
// 			shaft: Crankshaft
// 		) => Exhaust | Promise<Exhaust> | void | Promise<void>
// 	) => TRoutary
// }
