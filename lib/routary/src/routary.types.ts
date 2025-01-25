/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { type Server } from "bun"

export type TGear<$TChamber> = (intake: TIntake<$TChamber>) => TExhaust

export type TShaft<$TChamber> = Partial<Record<TBearing, Record<TGasket, TGear<$TChamber>>>>

export type TGasket = string

export type TIntake<$TChamber = Record<string, unknown>> = {
	req: Request
	server: Server
	params: Record<string, string>
} & $TChamber

export type TExhaust = Response | Promise<Response>

export type TBearing = "GET" | "PUT" | "HEAD" | "POST" | "PATCH" | "DELETE" | "OPTIONS"

export type TRoutary<$TChamber> = {
	use: <$TNewChamber extends Record<string, unknown>>(
		callback: (chamber: $TChamber, shaft: TShaft<$TChamber>) => TRoutary<$TChamber & $TNewChamber>,
	) => TRoutary<$TChamber & $TNewChamber>
	get: (gasket: TGasket, gear: TGear<$TChamber>) => TRoutary<$TChamber>
	post: (gasket: TGasket, gear: TGear<$TChamber>) => TRoutary<$TChamber>
	put: (gasket: TGasket, gear: TGear<$TChamber>) => TRoutary<$TChamber>
	patch: (gasket: TGasket, gear: TGear<$TChamber>) => TRoutary<$TChamber>
	delete: (gasket: TGasket, gear: TGear<$TChamber>) => TRoutary<$TChamber>
	head: (gasket: TGasket, gear: TGear<$TChamber>) => TRoutary<$TChamber>
	options: (gasket: TGasket, gear: TGear<$TChamber>) => TRoutary<$TChamber>
	each: (gasket: TGasket, bearings: TBearing[], gear: TGear<$TChamber>) => TRoutary<$TChamber>
	start: (chown_gear: TGear<$TChamber>) => (req: Request, server: Server) => Response | Promise<Response>
}
