/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { Colonoscope } from "@ordo-pink/oss-colonoscope"

export type Env = {}

export type Mut = {}

export type Method = "get" | "head" | "post" | "put" | "patch" | "delete" | "options" | (string & {})

export type Route = `/${string}`

export type RouteParams = Colonoscope.Results

export type Structure<$Env extends Env, $Mut extends Mut> = Partial<Record<Method, Record<Route, Handler<$Env, $Mut>>>>

export type HandlerParams<$Env extends Env, $Mut extends Mut> = {
	request: Request
	server: Bun.Server
	env: $Env
	mut: $Mut
	params: RouteParams
}

export type Handler<$Env extends Env, $Mut extends Mut> = (params: HandlerParams<$Env, $Mut>) => Response | Promise<Response>

export type Args<$Env extends Env, $Mut extends Mut> = [
	env: $Env,
	initial_mut?: $Mut,
	structure?: Structure<$Env, $Mut>,
	before_handlers?: BeforeEachCallback<$Env, $Mut>[],
	after_handlers?: AfterEachCallback<$Env, $Mut>[],
	on_creates?: OnceCallback<$Env, $Mut>[],
]

export type Pipe<$Env extends Env, $Mut extends Mut> = <_NewMut extends Mut>(
	op: (
		env: $Env,
		mut: $Mut,
		structure: Structure<$Env, $Mut>,
		before_handlers: BeforeEachCallback<$Env, $Mut>[],
		after_handlers: AfterEachCallback<$Env, $Mut>[],
		on_creates: OnceCallback<$Env, $Mut>[],
	) => Instance<$Env, _NewMut>,
) => Instance<$Env, _NewMut>

export type CatcherParams<$Env extends Env, $Mut extends Mut> = HandlerParams<$Env, $Mut> & {
	error: unknown
	response: Response | null
	matched_route: Route | null
}
export type Catcher<$Env extends Env, $Mut extends Mut> = (params: CatcherParams<$Env, $Mut>) => Response | Promise<Response>

export type OrElse<$Env extends Env, $Mut extends Mut> = (
	on_none_matched: Handler<$Env, $Mut>,
	catcher: (params: CatcherParams<$Env, $Mut>) => Response | Promise<Response>,
) => (request: Request, server: Bun.Server) => Response | Promise<Response>

export type Instance<$Env extends Env, $Mut extends Mut> = {
	pipe: Pipe<$Env, $Mut>
	or_else: OrElse<$Env, $Mut>
}

export type Create = <const $Env extends Env, $Mut extends Mut = Mut>(...args: Args<$Env, $Mut>) => Instance<$Env, $Mut>

export type Op<$Env extends Env, $Mut extends Mut> = (
	env: $Env,
	mut: $Mut,
	structure: Structure<$Env, $Mut>,
	before_handlers: BeforeEachCallback<$Env, $Mut>[],
	after_handlers: AfterEachCallback<$Env, $Mut>[],
	on_creates: OnceCallback<$Env, $Mut>[],
) => Instance<$Env, $Mut>

export type MutOp<$Env extends Env, $Mut extends Mut, $NewMut extends Mut> = (
	env: $Env,
	mut: $Mut,
	structure: Structure<$Env, $Mut>,
	before_handlers: BeforeEachCallback<$Env, $Mut>[],
	after_handlers: AfterEachCallback<$Env, $Mut>[],
	on_creates: OnceCallback<$Env, $Mut>[],
) => Instance<$Env, $Mut & $NewMut>

export type MethodHandler = <const $Env extends Env, $Mut extends Mut>(
	route: Route,
	handler: Handler<$Env, $Mut>,
) => Op<$Env, $Mut>

export type EachMethodHandler = <const $Env extends Env, $Mut extends Mut>(
	methods: Method[],
	route: Route,
	handler: Handler<$Env, $Mut>,
) => Op<$Env, $Mut>

export type CustomMethodHandler = <const $Env extends Env, $Mut extends Mut>(
	method: Method,
	route: Route,
	handler: Handler<$Env, $Mut>,
) => Op<$Env, $Mut>

export type BeforeEachCallbackParams<$Env extends Env, $Mut extends Mut> = HandlerParams<$Env, $Mut>
export type BeforeEachCallbackResult<$NewMut extends Mut> = $NewMut | Promise<$NewMut | void> | void
export type BeforeEachCallback<$Env extends Env, $Mut extends Mut> = <$NewMut extends Mut>(
	params: BeforeEachCallbackParams<$Env, $Mut>,
) => BeforeEachCallbackResult<$NewMut>
export type BeforeEach = <const $Env extends Env, $Mut extends Mut, $NewMut extends Mut>(
	callback: (params: BeforeEachCallbackParams<$Env, $Mut>) => BeforeEachCallbackResult<$NewMut>,
) => MutOp<$Env, $Mut, $NewMut>

export type AfterEachCallbackParams<$Env extends Env, $Mut extends Mut> = HandlerParams<$Env, $Mut> & {
	response: Response
	matched_route: Route | null
}
export type AfterEachCallbackResult<$NewMut extends Mut> = { mut?: $NewMut; response?: Response } | void
export type AfterEachCallback<$Env extends Env, $Mut extends Mut> = <$NewMut extends Mut>(
	params: AfterEachCallbackParams<$Env, $Mut>,
) => AfterEachCallbackResult<$NewMut> | Promise<AfterEachCallbackResult<$NewMut>>
export type AfterEach = <const $Env extends Env, $Mut extends Mut, $NewMut extends Mut>(
	callback: (
		params: AfterEachCallbackParams<$Env, $Mut>,
	) => AfterEachCallbackResult<$NewMut> | Promise<AfterEachCallbackResult<$NewMut>>,
) => MutOp<$Env, $Mut, $NewMut>

export type OnceCallbackParams<$Env extends Env, $Mut extends Mut> = { env: $Env; structure: Structure<$Env, $Mut> }
export type OnceCallback<$Env extends Env, $Mut extends Mut> = (params: OnceCallbackParams<$Env, $Mut>) => {
	before_each?: BeforeEachCallback<$Env, $Mut>
	after_each?: AfterEachCallback<$Env, $Mut>
}

export type Once = <const $Env extends Env, $Mut extends Mut>(callback: OnceCallback<$Env, $Mut>) => Op<$Env, $Mut>

export type Ops = {
	after_each: AfterEach
	before_each: BeforeEach
	custom: CustomMethodHandler
	delete: MethodHandler
	each: EachMethodHandler
	get: MethodHandler
	head: MethodHandler
	once: Once
	options: MethodHandler
	patch: MethodHandler
	post: MethodHandler
	put: MethodHandler
}
