/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { expect, test } from "bun:test"
import { routary_ordo } from "./routary-ordo.impl"

test("routary-ordo should pass", () => {
	expect(routary_ordo).toEqual("routary-ordo")
})
