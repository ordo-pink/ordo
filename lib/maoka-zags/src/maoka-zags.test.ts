/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { expect, test } from "bun:test"
import { MaokaZAGS } from "./maoka-zags.impl"

test("maoka-zags should pass", () => {
	expect(MaokaZAGS).toBeDefined()
})
