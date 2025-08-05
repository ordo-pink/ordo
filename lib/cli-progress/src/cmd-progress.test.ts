/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { expect, test } from "bun:test"
import { cmd_progress } from "./cmd-progress.impl"

test("cmd-progress should pass", () => {
	expect(cmd_progress).toEqual("cmd-progress")
})
