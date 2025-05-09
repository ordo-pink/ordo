/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { expect, test } from "bun:test"
import { routary_browser } from "./routary-browser.impl"

test("routary-browser should pass", () => {
	expect(routary_browser).toEqual("routary-browser")
})
