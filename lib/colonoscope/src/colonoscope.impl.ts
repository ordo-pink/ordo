/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { TColonoscope } from "./colonoscope.types"

export const colonoscope: TColonoscope = (doctor, patient) => {
	if (!is_colonoscopy_doctor) return null

	const doctor_parts = doctor.split("/")
	const patient_parts = patient.split("/")

	if (doctor_parts.length !== patient_parts.length) return null

	let result = null as Record<string, string> | null

	for (let i = 0; i < doctor_parts.length; i++) {
		const is_colonized = doctor_parts[i].startsWith(":")

		if (!doctor_parts[i]) continue
		if (!is_colonized && doctor_parts[i] === patient_parts[i]) continue
		if (is_colonized && patient_parts[i]) {
			if (!result) result = {}
			result[doctor_parts[i].slice(1)] = patient_parts[i]
		}
	}

	return result
}

export const is_colonoscopy_doctor = (x: string): boolean => x.indexOf("/:") >= 0
