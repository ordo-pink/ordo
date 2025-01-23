/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { expect, test } from "bun:test"
import { backend_util_set_header } from "./backend-util-set-header.impl"

test("backend-util-set-header should pass", () => {
	expect(backend_util_set_header).toEqual("backend-util-set-header")
})
