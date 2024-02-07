// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Router, operators } from "silkrouter"
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject"
import { map } from "rxjs/internal/operators/map"

import { activities$, currentFID$ } from "@ordo-pink/frontend-stream-activities"
import { callOnce } from "@ordo-pink/tau"
import { getCommands } from "@ordo-pink/frontend-stream-commands"
import { getLogger } from "@ordo-pink/frontend-logger"

const { route, noMatch } = operators

export const __initRouter = callOnce((fid: symbol) => {
	const commands = getCommands(fid)
	const logger = getLogger(fid)

	logger.debug("Initializing router...")

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
								currentFID$.next((activity as any).fid)
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

	logger.debug("Initialized router.")
})

export const router$ = new Router({ hashRouting: false, init: true })
export const currentRoute$ = new BehaviorSubject<Client.Router.Route | null>(null)
