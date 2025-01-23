/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { expect, test } from "bun:test"
import { routary } from "./routary.impl"

test("routary should pass", () => {
	expect(routary).toEqual("routary")
})
