// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { test, expect } from "bun:test"
import { backendRusenderEmailRepository } from "./impl"

test("backend-rusender-email-repository should pass", () => {
	expect(backendRusenderEmailRepository).toEqual("backend-rusender-email-repository")
})
