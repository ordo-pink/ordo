/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { expect, test } from "bun:test"
import { maoka_render_dom } from "./maoka-render-dom.impl"

test("maoka-render-dom should pass", () => {
	expect(maoka_render_dom).toEqual("maoka-render-dom")
})
