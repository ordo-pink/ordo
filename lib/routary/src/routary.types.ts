/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { type Server } from "bun"

export type TGear<$TChamber> = (intake: TIntake<$TChamber>) => TExhaust

export type TShaft<$TChamber> = Partial<Record<TBearing, Record<TGasket, TGear<$TChamber>>>>

export type TGasket = string

export type TIntake<$TChamber> = { req: Request; server: Server; params: Record<string, string> } & $TChamber

export type TExhaust = Response | Promise<Response>

export type TBearing = "GET" | "PUT" | "HEAD" | "POST" | "PATCH" | "DELETE" | "OPTIONS"

export type TRotary<$TChamber> = {
	get: (gasket: TGasket, gear: TGear<$TChamber>) => TRotary<$TChamber>
	post: (gasket: TGasket, gear: TGear<$TChamber>) => TRotary<$TChamber>
	put: (gasket: TGasket, gear: TGear<$TChamber>) => TRotary<$TChamber>
	patch: (gasket: TGasket, gear: TGear<$TChamber>) => TRotary<$TChamber>
	delete: (gasket: TGasket, gear: TGear<$TChamber>) => TRotary<$TChamber>
	head: (gasket: TGasket, gear: TGear<$TChamber>) => TRotary<$TChamber>
	options: (gasket: TGasket, gear: TGear<$TChamber>) => TRotary<$TChamber>
	each: (gasket: TGasket, bearings: TBearing[], gear: TGear<$TChamber>) => TRotary<$TChamber>
	or_else: (chown_gear: TGear<$TChamber>) => (req: Request, server: Server) => Response | Promise<Response>
}
