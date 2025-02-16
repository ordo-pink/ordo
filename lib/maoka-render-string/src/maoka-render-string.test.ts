/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { expect, test } from "bun:test"
import { maoka_render_string } from "./maoka-render-string.impl"

test("maoka-render-string should pass", () => {
	expect(maoka_render_string).toEqual("maoka-render-string")
})
