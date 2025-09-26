/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { Check, Doctor, IsDoctor } from "./colonoscope.types"

export const check: Check = (doctor, patient) => {
	if (!is_doctor(doctor)) return null // You cannot do colonoscopy without a colon

	const doctor_limbs = doctor.split("/")
	const patient_limbs = patient.split("/")

	// TODO: Add support for *
	if (doctor_limbs.length !== patient_limbs.length) return null // Different amount of limbs

	let result = null

	for (let i = 0; i < doctor_limbs.length; i++) {
		const limb = doctor_limbs[i]

		if (!limb) continue

		const bizkit = patient_limbs[i] // Now I know why you wanna hate me
		const is_colonized = limb.startsWith(":")

		if (!is_colonized && limb !== bizkit) return null
		if (is_colonized && bizkit) {
			if (!result) result = {} as Record<string, string>
			result[limb.slice(1)] = bizkit
		}
	}

	return result
}

export const is_doctor: IsDoctor = (x): x is Doctor => x.indexOf("/:") >= 0
