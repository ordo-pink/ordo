/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { expect, test } from "bun:test"
import { handle_routary_with_colonoscope } from "./routary-colonoscope.impl"

test("routary-colonoscope should pass", () => {
	expect(handle_routary_with_colonoscope).toEqual("routary-colonoscope")
})
