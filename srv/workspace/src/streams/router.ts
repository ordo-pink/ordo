// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Router, operators } from "silkrouter"
import { Unary, callOnce } from "@ordo-pink/tau"
import { Logger } from "@ordo-pink/logger"
import { getCommands } from "$streams/commands"
import { BehaviorSubject, Observable, map } from "rxjs"
import { __Activities$ } from "./activities"

const commands = getCommands()

const { route, noMatch } = operators

export type __CurrentRoute$ = Observable<Client.Router.Route | null>
export const __initRouter: InitRouter = callOnce(({ logger, activities$ }) => {
	logger.debug("Initializing router")

	commands.on<cmd.router.navigate>("router.navigate", ({ payload }) => {
		if (Array.isArray(payload)) {
			router$.set(...(payload as [string]))
			return
		}

		router$.set(payload)
	})

	commands.on<cmd.router.openExternal>(
		"router.open-external",
		({ payload: { url, newTab = true } }) => {
			logger.debug("Opening external page", { url, newTab })
			newTab ? window.open(url, "_blank")?.focus() : (window.location.href = url)
		},
	)

	activities$
		.pipe(
			map(activities => {
				activities?.map(activity => {
					return activity.routes.forEach(activityRoute => {
						router$ &&
							router$.pipe(route(activityRoute)).subscribe((routeData: Client.Router.Route) => {
								commands.emit<cmd.activities.setCurrent>("activities.set-current", activity)
								currentRoute$.next(routeData)
							})
					})
				})

				router$ &&
					router$.pipe(noMatch(router$)).subscribe(() => {
						commands.emit<cmd.activities.setCurrent>(
							"activities.set-current",
							activities.find(activity => activity.name === "home"),
						)
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

	return currentRoute$
})

type Params = { logger: Logger; activities$: __Activities$ }
type InitRouter = Unary<Params, __CurrentRoute$>

const router$ = new Router({ hashRouting: false, init: true })
const currentRoute$ = new BehaviorSubject<Client.Router.Route | null>(null)
