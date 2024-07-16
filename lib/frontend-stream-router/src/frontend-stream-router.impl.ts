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

import { BehaviorSubject, Observable, map } from "rxjs"
import { Router, operators } from "silkrouter"

import { O, type TOption } from "@ordo-pink/option"
import {
	type TFIDAwareActivity,
	type TGetCurrentRouteFn,
	type TSetCurrentActivityFn,
	type TSetCurrentFIDFn,
} from "@ordo-pink/core"
import { KnownFunctions } from "@ordo-pink/frontend-known-functions"
import { RRR } from "@ordo-pink/data"
import { Result } from "@ordo-pink/result"
import { type TLogger } from "@ordo-pink/logger"
import { call_once } from "@ordo-pink/tau"

const { route, noMatch } = operators

type TInitRouterStreamFn = (params: {
	app_fid: symbol
	logger: TLogger
	commands: Client.Commands.Commands
	activities$: Observable<TFIDAwareActivity[]>
	set_current_activity: TSetCurrentActivityFn
	set_current_fid: TSetCurrentFIDFn
}) => { get_current_route: TGetCurrentRouteFn }
export const init_router: TInitRouterStreamFn = call_once(
	({ app_fid, logger, commands, activities$, set_current_activity, set_current_fid }) => {
		logger.debug("Initializing router...")

		const set_fid = set_current_fid(app_fid)
		const set_activity = set_current_activity(app_fid)

		const eperm = RRR.codes.eperm("init_router")

		commands.on<cmd.router.navigate>("router.navigate", payload => {
			if (Array.isArray(payload)) {
				router$.set(...(payload as [string]))
				return
			}

			router$.set(payload)
		})

		commands.on<cmd.router.open_external>("router.open_external", ({ url, new_tab = true }) => {
			logger.debug("Opening external page", { url, new_tab })
			new_tab ? window.open(url, "_blank")?.focus() : (window.location.href = url)
		})

		activities$
			.pipe(
				map(activities => {
					activities?.map(activity => {
						return activity.routes.forEach(activity_route => {
							router$ &&
								router$.pipe(route(activity_route)).subscribe((route_data: Client.Router.Route) => {
									set_activity(activity.name)
									set_fid(activity.fid)
									current_route$.next(O.FromNullable(route_data))
								})
						})
					})

					router$ &&
						router$.pipe(noMatch(router$)).subscribe(() => {
							const home_activity = activities.find(activity => activity.name === "home")!
							set_activity(home_activity.name)
							set_fid(home_activity.fid)

							current_route$.next(
								O.Some({
									data: null,
									hash: "",
									hashRouting: false,
									params: {},
									path: "/",
									route: "/",
									search: "",
								}),
							)
						})
				}),
			)
			.subscribe()

		logger.debug("Initialized router.")

		return {
			get_current_route: fid => () =>
				Result.If(KnownFunctions.check_permissions(fid, { queries: ["application.current_route"] }))
					.pipe(Result.ops.err_map(() => eperm(`get_current_route -> fid: ${String(fid)}`)))
					.pipe(Result.ops.map(() => current_route$.asObservable())),
		}
	},
)

export const router$ = new Router({ hashRouting: false, init: true })
export const current_route$ = new BehaviorSubject<TOption<Client.Router.Route>>(O.None())
