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

import { Router, operators } from "silkrouter"
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject"
import { map } from "rxjs/internal/operators/map"

import { activities$, currentActivity$, current_fid$ } from "@ordo-pink/frontend-stream-activities"
import { call_once } from "@ordo-pink/tau"
import { TLogger } from "@ordo-pink/logger"
import { Observable } from "rxjs"
import { TOption } from "@ordo-pink/option"

const { route, noMatch } = operators

type TInitRouterStreamFn = (params: {
	logger: TLogger
	commands: Client.Commands.Commands
	activities$: Observable<TOption<Functions.Activity[]>>
	set_current_activity: (activity: Functions.Activity) => void
	set_current_fid$: 
}) => void
export const __init_router$: TInitRouterStreamFn = call_once(
	({ logger, commands, activities$ }) => {
		logger.debug("Initializing router...")

		commands.on<cmd.router.navigate>("router.navigate", payload => {
			if (Array.isArray(payload)) {
				router$.set(...(payload as [string]))
				return
			}

			router$.set(payload)
		})

		commands.on<cmd.router.open_external>("router.open_external", ({ url, newTab = true }) => {
			logger.debug("Opening external page", { url, newTab })
			newTab ? window.open(url, "_blank")?.focus() : (window.location.href = url)
		})

		activities$
			.pipe(
				map(activities => {
					activities?.map(activity => {
						return activity.routes.forEach(activityRoute => {
							router$ &&
								router$.pipe(route(activityRoute)).subscribe((routeData: Client.Router.Route) => {
									currentActivity$.next(activity)
									currentRoute$.next(routeData)
									current_fid$.next((activity as any).fid)
								})
						})
					})

					router$ &&
						router$.pipe(noMatch(router$)).subscribe(() => {
							const homeActivity = activities.find(activity => activity.name === "home")
							currentActivity$.next(homeActivity!)
							current_fid$.next((homeActivity as any).fid)

							currentRoute$.next({
								data: null,
								hash: "",
								hashRouting: false,
								params: {},
								path: "/",
								route: "/",
								search: "",
							})
						})
				}),
			)
			.subscribe()

		logger.debug("Initialized router.")
	},
)

export const router$ = new Router({ hashRouting: false, init: true })
export const currentRoute$ = new BehaviorSubject<Client.Router.Route | null>(null)
