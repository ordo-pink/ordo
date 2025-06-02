/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { expect, test } from "bun:test"
import { cmd_license } from "./cmd-license.impl"

test("cmd-license should pass", () => {
	expect(cmd_license).toEqual("cmd-license")
})
