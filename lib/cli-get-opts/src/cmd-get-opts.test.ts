/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { expect, test } from "bun:test"
import { cmd_get_opts } from "./cmd-get-opts.impl"

test("cmd-get-opts should pass", () => {
	expect(cmd_get_opts).toEqual("cmd-get-opts")
})
