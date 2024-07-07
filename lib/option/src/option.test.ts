// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { test, expect } from "bun:test"
import { option } from "./option.impl"

test("option should pass", () => {
	expect(option).toEqual("option")
})
