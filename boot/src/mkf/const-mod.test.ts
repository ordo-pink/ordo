// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { test, expect } from "bun:test"
import { constMod } from "./const-mod"

test("const-mod should pass", () => {
	expect(constMod).toEqual("const-mod")
})
