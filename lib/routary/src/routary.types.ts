/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { type Server } from "bun"

export namespace Routary {
	export type Gear<$Fuel> = (intake: Routary.Intake<$Fuel>) => Response | Promise<Response>

	export type Shaft<$Fuel> = Partial<Record<Routary.Bearing, Record<Routary.Gasket, Routary.Gear<$Fuel>>>>

	export type Gasket = string

	export type Exhaust = {
		headers: Headers
		status: number
		body: BodyInit | null
	}

	export type Intake<$Fuel = Record<string, unknown>> = $Fuel & {
		req: Request
		server: Server
		res: Routary.Exhaust
		params: Record<string, string>
	}

	export type Bearing = "GET" | "PUT" | "HEAD" | "POST" | "PATCH" | "DELETE" | "OPTIONS"

	export type Static = {
		http: <$Fuel>(fuel: $Fuel, shaft?: Routary.Shaft<$Fuel>) => Routary.Instance<$Fuel>
	}

	export type Instance<$Fuel> = {
		use: <$NewFuel extends Record<string, unknown>>(
			callback: (fuel: $Fuel, shaft: Routary.Shaft<$Fuel>) => Routary.Instance<$Fuel & $NewFuel>,
		) => Routary.Instance<$Fuel & $NewFuel>
		get: (gasket: Routary.Gasket, gear: Routary.Gear<$Fuel>) => Routary.Instance<$Fuel>
		post: (gasket: Routary.Gasket, gear: Routary.Gear<$Fuel>) => Routary.Instance<$Fuel>
		put: (gasket: Routary.Gasket, gear: Routary.Gear<$Fuel>) => Routary.Instance<$Fuel>
		patch: (gasket: Routary.Gasket, gear: Routary.Gear<$Fuel>) => Routary.Instance<$Fuel>
		delete: (gasket: Routary.Gasket, gear: Routary.Gear<$Fuel>) => Routary.Instance<$Fuel>
		head: (gasket: Routary.Gasket, gear: Routary.Gear<$Fuel>) => Routary.Instance<$Fuel>
		options: (gasket: Routary.Gasket, gear: Routary.Gear<$Fuel>) => Routary.Instance<$Fuel>
		each: (gasket: Routary.Gasket, bearings: Routary.Bearing[], gear: Routary.Gear<$Fuel>) => Routary.Instance<$Fuel>
		start: (crown_gear: Routary.Gear<$Fuel>) => (req: Request, server: Server) => Response | Promise<Response>
	}
}
