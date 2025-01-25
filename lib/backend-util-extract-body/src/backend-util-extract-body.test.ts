/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { expect, test } from "bun:test"
import { backend_util_extract_body } from "./backend-util-extract-body.impl"

test("backend-util-extract-body should pass", () => {
	expect(backend_util_extract_body).toEqual("backend-util-extract-body")
})
