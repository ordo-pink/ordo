// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { test, expect } from "bun:test"
import { mkf } from "./impl"

test("mkf should pass", () => {
	expect(mkf).toEqual("Hello from mkf bin!")
})
