/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { Logger, Rrr } from "@ordo-pink/sdk-core"
import type { LOCALE } from "@ordo-pink/i18n"
import type { Oath } from "@ordo-pink/oath"
import type { Routary } from "@ordo-pink/routary"

export module RoutaryOrdo {
	export type Fuel = {
		headers: Headers
		logger: Logger
		payload?: unknown
		request_id?: string
		request_ip?: string
		request_language: LOCALE
		response_time?: number
		stop_response_timer?: ResponseTimer
		status: number
	}

	export type SetHeader = (key: string, value: string) => <$Intake extends { headers: Headers }>(intake: $Intake) => void

	export type SetHeaderCurry = (key: string) => (value: string) => <$Fuel extends { headers: Headers }>(intake: $Fuel) => void

	export type ResponseTimer = () => void

	export type StartResponseTimer = <$Fuel extends RoutaryOrdo.Fuel>(intake: $Fuel) => void

	export type StopResponseTimer = <$Fuel extends RoutaryOrdo.Fuel>(intake: $Fuel) => void

	export type LogRequest = <$Intake extends Routary.Intake<RoutaryOrdo.Fuel>>(params: $Intake) => void

	export type AssignRequestId = <$Intake extends RoutaryOrdo.Fuel>(intake: $Intake) => void

	export type AssignRequestLanguage = <$Intake extends Routary.Intake<RoutaryOrdo.Fuel>>(intake: $Intake) => void

	export type ExtractRequestIP = <$Intake extends Routary.Intake<RoutaryOrdo.Fuel>>(intake: $Intake) => void

	export type ExtractJSONBody = <$Intake extends Routary.Intake = Routary.Intake>(
		intake: $Intake,
	) => Oath.Instance<any, { rrr: Rrr.Instance<"EIO">; intake: Routary.Intake<any> }>

	export type Rejection = { rrr: Rrr.Instance; intake: Routary.Intake<RoutaryOrdo.Fuel> }
}
