/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { describe, expect, it } from "bun:test"

import { client_app } from "./client-app.impl"

describe("client-app", () => {
	it("should exist", () => {
		expect(client_app).toBe("client-app")
	})
})
