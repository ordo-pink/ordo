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

	export type Instance<$Chamber> = {
		use: <$TNewChamber extends Record<string, unknown>>(
			callback: (chamber: $Chamber, shaft: Shaft<$Chamber>) => Instance<$Chamber & $TNewChamber>,
		) => Instance<$Chamber & $TNewChamber>
		get: (gasket: Gasket, gear: Gear<$Chamber>) => Instance<$Chamber>
		post: (gasket: Gasket, gear: Gear<$Chamber>) => Instance<$Chamber>
		put: (gasket: Gasket, gear: Gear<$Chamber>) => Instance<$Chamber>
		patch: (gasket: Gasket, gear: Gear<$Chamber>) => Instance<$Chamber>
		delete: (gasket: Gasket, gear: Gear<$Chamber>) => Instance<$Chamber>
		head: (gasket: Gasket, gear: Gear<$Chamber>) => Instance<$Chamber>
		options: (gasket: Gasket, gear: Gear<$Chamber>) => Instance<$Chamber>
		each: (gasket: Gasket, bearings: Bearing[], gear: Gear<$Chamber>) => Instance<$Chamber>
		start: (crown_gear: Gear<$Chamber>) => (req: Request, server: Server) => Response | Promise<Response>
	}
}
