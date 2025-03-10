/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { expect, test } from "bun:test"
import { maoka_styled } from "./maoka-styled.impl"

test("maoka-styled should pass", () => {
	expect(maoka_styled).toEqual("maoka-styled")
})
