// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { test, expect } from "bun:test"
import { result } from "./result.impl"

test("result should pass", () => {
	expect(result).toEqual("result")
})
