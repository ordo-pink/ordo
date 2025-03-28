/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { expect, test } from "bun:test"
import { rickroll } from "./rickroll.impl"

test("rickroll should never give you up", () => {
	expect(rickroll).toBeInstanceOf(Response)
})

test("rickroll should never let you down", () => {
	expect(rickroll.headers.get("Location")).toEqual("https://youtu.be/dQw4w9WgXcQ?si=29zcluWnkgBz4P5t")
})

test("rickroll should never run around and desert you", () => {
	expect(rickroll.status).toEqual(303)
})
