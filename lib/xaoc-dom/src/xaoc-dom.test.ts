// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { test, expect } from "bun:test"
import { xaocDom } from "./xaoc-dom.impl"

test("xaoc-dom should pass", () => {
	expect(xaocDom).toEqual("xaoc-dom")
})
