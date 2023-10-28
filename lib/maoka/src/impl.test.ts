// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { test, expect } from "bun:test"
import { maoka } from "./impl"

test("maoka should pass", () => {
	expect(maoka).toEqual("maoka")
})
