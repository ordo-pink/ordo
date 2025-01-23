/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

export type TBackendUtilResponseTimeExpectedIntake = {
	response_time?: string
	response_timer?: [number, number]
	headers: Record<string, string>
}
