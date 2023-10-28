// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { test, expect } from "bun:test"
import { checkjsx } from "./impl"

test("checkjsx should pass", () => {
	expect(checkjsx).toEqual("checkjsx")
})
