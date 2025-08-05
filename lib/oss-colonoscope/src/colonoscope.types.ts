/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

export type Doctor = `/${string}`
export type Patient = `/${string}`

/** Expected members of the colonoscopy check. */
export type Args = [doctor: Doctor, patient: Patient]

/** Colonoscopy results if it went well, or null otherwise. */
export type Results = Record<string, string> | null

/**
 * Colonoscopy check is a warm and welcoming party where a **doctor** (i.e. a
 * parameterized string representing enpoint url, e.g. `/hello/:what`) does
 * **colonoscopy** (i.e. checking for presence of colons and extracting
 * associated parameters) to a **patient** (i.e. an actual url). Unlike some
 * other libraries out there, `colonoscope` does not use regular expressions
 * (and other AI stuff), it just inspects the patient limb by limb instead.
 */
export type Check = (...args: Args) => Results

/** Colonoscopy doctor guard. Doctors doing that to people do need a guard. */
export type IsDoctor = (x: any) => x is Doctor
