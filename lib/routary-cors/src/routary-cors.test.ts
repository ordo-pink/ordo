/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { expect, test } from "bun:test"
import { routary_cors } from "./routary-cors.impl"

test("routary-cors should pass", () => {
	expect(routary_cors).toEqual("routary-cors")
})
