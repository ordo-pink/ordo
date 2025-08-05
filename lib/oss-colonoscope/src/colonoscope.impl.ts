/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type * as Types from "./colonoscope.types.ts"

export const check: Types.Check = (doctor, patient) => {
	if (!is_doctor(doctor)) return null // You cannot do colonoscopy without a colon

	const doctor_limbs = doctor.split("/")
	const patient_limbs = patient.split("/")

	// TODO: Add support for *
	if (doctor_limbs.length !== patient_limbs.length) return null // Different amount of limbs

	let result = null as Record<string, string> | null

	for (let i = 0; i < doctor_limbs.length; i++) {
		const limb = doctor_limbs[i]

		if (!limb) continue

		const bizkit = patient_limbs[i] // Now I know why you wanna hate me
		const is_colonized = limb.startsWith(":")

		if (!is_colonized && limb !== bizkit) return null
		if (is_colonized && bizkit) {
			if (!result) result = {}
			result[limb.slice(1)] = bizkit
		}
	}

	return result
}

export const is_doctor: Types.IsDoctor = (x): x is Types.Doctor => x.indexOf("/:") >= 0
