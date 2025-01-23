/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { expect, test } from "bun:test"
import { backend_util_extract_request_ip } from "./backend-util-extract-request-ip.impl"

test("backend-util-extract-request-ip should pass", () => {
	expect(backend_util_extract_request_ip).toEqual("backend-util-extract-request-ip")
})
