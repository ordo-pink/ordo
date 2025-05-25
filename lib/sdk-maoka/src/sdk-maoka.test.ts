/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { expect, test } from "bun:test"
import { sdk_maoka } from "./sdk-maoka.impl"

test("sdk-maoka should pass", () => {
	expect(sdk_maoka).toEqual("sdk-maoka")
})
