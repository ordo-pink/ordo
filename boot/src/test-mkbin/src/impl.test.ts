// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { test, expect } from "bun:test"
import { testMkbin } from "./impl"

test("test-mkbin should pass", () => {
	expect(testMkbin).toEqual("Hello from test-mkbin bin!")
})
