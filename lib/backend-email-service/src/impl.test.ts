// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { test, expect } from "bun:test"
import { backendEmailService } from "./impl"

test("backend-email-service should pass", () => {
	expect(backendEmailService).toEqual("backend-email-service")
})
