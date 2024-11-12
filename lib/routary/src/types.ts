// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { Oath } from "@ordo-pink/oath"
import { RoutaryResponse } from "./impl"

export type RequiredRouterState = {
	check_route: CheckRouteFn
	check_method: CheckMethodFn
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
	or_else: RouterOrElseHandler<T>
}
