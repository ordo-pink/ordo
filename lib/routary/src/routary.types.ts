/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { type Server } from "bun"

export module Routary {
	export type Gear<$Chamber> = (intake: Intake<$Chamber>) => Exhaust

	export type Shaft<$Chamber> = Partial<Record<Bearing, Record<Gasket, Gear<$Chamber>>>>

	export type Gasket = string

	export type Intake<$Chamber = Record<string, unknown>> = {
		req: Request
		server: Server
		params: Record<string, string>
	} & $Chamber

	export type Exhaust = Response | Promise<Response>

	export type Bearing = "GET" | "PUT" | "HEAD" | "POST" | "PATCH" | "DELETE" | "OPTIONS"

	export type Instance<$TChamber> = {
		use: <$TNewChamber extends Record<string, unknown>>(
			callback: (chamber: $TChamber, shaft: Shaft<$TChamber>) => Instance<$TChamber & $TNewChamber>,
		) => Instance<$TChamber & $TNewChamber>
		get: (gasket: Gasket, gear: Gear<$TChamber>) => Instance<$TChamber>
		post: (gasket: Gasket, gear: Gear<$TChamber>) => Instance<$TChamber>
		put: (gasket: Gasket, gear: Gear<$TChamber>) => Instance<$TChamber>
		patch: (gasket: Gasket, gear: Gear<$TChamber>) => Instance<$TChamber>
		delete: (gasket: Gasket, gear: Gear<$TChamber>) => Instance<$TChamber>
		head: (gasket: Gasket, gear: Gear<$TChamber>) => Instance<$TChamber>
		options: (gasket: Gasket, gear: Gear<$TChamber>) => Instance<$TChamber>
		each: (gasket: Gasket, bearings: Bearing[], gear: Gear<$TChamber>) => Instance<$TChamber>
		start: (crown_gear: Gear<$TChamber>) => (req: Request, server: Server) => Response | Promise<Response>
	}
}
