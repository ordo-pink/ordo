/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { expect, test } from "bun:test"
import { sdk_ts } from "./sdk-ts.impl"

test("sdk-ts should pass", () => {
	expect(sdk_ts).toEqual("sdk-ts")
})
