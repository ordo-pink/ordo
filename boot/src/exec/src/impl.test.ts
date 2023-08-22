// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { test, expect } from "bun:test"
import { exec } from "./impl"

test("exec should pass", () => {
	expect(exec).toEqual("Hello from exec bin!")
})
