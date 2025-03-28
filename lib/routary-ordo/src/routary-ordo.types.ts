/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { Logger } from "@ordo-pink/logger"
import type { Routary } from "@ordo-pink/routary"
import type { TWO_LETTER_LOCALE } from "@ordo-pink/locale"

export module RoutaryOrdo {
	export type Chamber = {
		headers: Headers
		logger: Logger
		payload?: unknown
		request_id?: string
		request_ip?: string
		request_language: TWO_LETTER_LOCALE
		response_time?: number
		stop_response_timer?: ResponseTimer
		status: number
		user_persistence_strategy: OrdoBackend.User.PersistenceStrategy
	}

	export type SetHeader = (key: string, value: string) => <$Intake extends { headers: Headers }>(intake: $Intake) => void

	export type SetHeaderCurry = (
		key: string,
	) => (value: string) => <$Chamber extends { headers: Headers }>(intake: $Chamber) => void

	export type ResponseTimer = () => void

	export type StartResponseTimer = <$Chamber extends RoutaryOrdo.Chamber>(intake: $Chamber) => void

	export type StopResponseTimer = <$Chamber extends RoutaryOrdo.Chamber>(intake: $Chamber) => void

	export type LogRequest = <$Intake extends Routary.Intake<RoutaryOrdo.Chamber>>(params: $Intake) => void

	export type ExtractRequestIP = <$Intake extends Routary.Intake<RoutaryOrdo.Chamber>>(intake: $Intake) => void

	export type ExtractJSONBody = <$Intake extends Routary.Intake = Routary.Intake>(intake: $Intake) => any

	export type Rejection = { rrr: Ordo.Rrr; intake: Routary.Intake<RoutaryOrdo.Chamber> }
}
