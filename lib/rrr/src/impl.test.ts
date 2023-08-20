// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { test, expect } from "bun:test"
import { rrr } from "./impl"

test("rrr should pass", () => {
	expect(rrr).toEqual("rrr")
})
