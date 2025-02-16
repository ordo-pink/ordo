/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { expect, test } from "bun:test"
import { backend_dt } from "./backend-dt.impl"

test("backend-dt should pass", () => {
	expect(backend_dt).toEqual("backend-dt")
})
