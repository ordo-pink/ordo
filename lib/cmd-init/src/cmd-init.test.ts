/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { expect, test } from "bun:test"
import { cmd_init } from "./cmd-init.impl"

test("cmd-init should pass", () => {
	expect(cmd_init).toEqual("cmd-init")
})
