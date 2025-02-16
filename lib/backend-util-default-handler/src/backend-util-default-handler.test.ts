/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { expect, test } from "bun:test"
import { backend_util_default_handler } from "./backend-util-default-handler.impl"

test("backend-util-default-handler should pass", () => {
	expect(backend_util_default_handler).toEqual("backend-util-default-handler")
})
